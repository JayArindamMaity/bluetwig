import os
import re
import inflect
import readchar
from rich.console import Console
from dotenv import load_dotenv

# Try importing the Google library with error handling
try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

load_dotenv()

console = Console()

ALLOWED_PLATFORMS = ["leetcode", "codeforces", "codechef"]

# Map generic language keys to the specific casing required by the TS interface
LANG_MAP = {
    "c": {"default": "C"},
    "cpp": {"codechef": "Cpp", "default": "cpp"}, 
    "java": {"default": "Java"},
    "python": {"default": "Python"},
    "rust": {"default": "Rust"},
}

# Updated Prompt for Inline Comments
PROMPT_CONFIG = """You are an expert programmer.
Your task is to add concise, explanatory comments to the following code.

Instructions:
1. Return the **FULL** code with comments added.
2. Add comments using the standard syntax for the language (e.g., // for C++/Java, # for Python).
3. Place comments on the same line as the code (e.g., `int a = 5; // comment`) where possible.
4. Explain the **logic** or **purpose** of the line.
5. **DO NOT** change the code logic, variable names, or structure.
6. **DO NOT** wrap the output in markdown code blocks (like ```cpp). Just return the raw text.

Code:
{code}
"""

MODEL_NAME = "models/gemini-2.5-pro"

# --- Helper Functions ---

def get_lang_key(user_lang, platform):
    mapping = LANG_MAP.get(user_lang, {})
    return mapping.get(platform, mapping.get("default", user_lang))

def to_camel_case_var(num_or_str):
    if str(num_or_str).isdigit():
        p = inflect.engine()
        words = p.number_to_words(num_or_str).replace("-", " ").replace(",", "")
        parts = words.split()
        camel_case = parts[0].lower() + "".join(x.title() for x in parts[1:])
        return f"{camel_case}Questions"
    else:
        return f"{num_or_str}Questions"

def escape_backticks(text):
    if not text: return ""
    return text.replace("`", "\\`").replace("${", "\\${")

def unescape_backticks(text):
    if not text: return ""
    return text.replace("\\`", "`").replace("\\${", "${")

def strip_markdown(text):
    """Removes markdown code fencing if Gemini adds it."""
    # Remove starting ```lang
    text = re.sub(r"^```\w*\n", "", text)
    # Remove ending ```
    text = re.sub(r"\n```$", "", text)
    return text.strip()

# --- Gemini Logic ---

def add_comments_to_code(code: str) -> str:
    if not HAS_GEMINI:
        console.print("[red]Error: 'google-generativeai' library not found. Run `pip install google-generativeai`.[/red]")
        return code

    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = PROMPT_CONFIG.format(code=code)
        
        with console.status("[bold green]Gemini is reading your code and adding comments...[/bold green]"):
            response = model.generate_content(
                prompt, generation_config={"max_output_tokens": 2000}
            )
            
        if response.candidates and response.candidates[0].content.parts:
            raw_text = response.candidates[0].content.parts[0].text.strip()
            return strip_markdown(raw_text)
            
    except Exception as e:
        console.print(f"[red]Error connecting to Gemini: {e}[/red]")
    
    return code # Return original code if failure

# --- UI Functions ---

def select_from_list(title, options):
    index = 0
    while True:
        console.clear()
        console.print(f"[bold cyan]{title}[/bold cyan]\n")
        for i, opt in enumerate(options):
            if i == index:
                console.print(f"[reverse]{opt}[/reverse]")
            else:
                console.print(opt)
        key = readchar.readkey()
        if key == readchar.key.UP:
            index = (index - 1) % len(options)
        elif key == readchar.key.DOWN:
            index = (index + 1) % len(options)
        elif key == readchar.key.ENTER:
            return options[index]

def get_multiline_input(prompt, end_marker="endloop"):
    console.print(f"[cyan]{prompt} (end with '{end_marker}'):[/cyan]")
    lines = []
    while True:
        try:
            line = input()
        except EOFError:
            break
        if line.strip() == end_marker:
            break
        lines.append(line)
    return "\n".join(lines)

# --- File Operations ---

def build_output_path(platform, category):
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    base_path = os.path.join(project_root, "frontend", "src", "data", platform)
    os.makedirs(base_path, exist_ok=True)
    return os.path.join(base_path, f"{category}.ts")

def parse_existing_file(filepath):
    if not os.path.exists(filepath):
        return []

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r"export const \w+.*?:.*?\[(.*?)\];", content, re.DOTALL)
    if not match:
        match = re.search(r"export const \w+\s*=\s*\[(.*?)\];", content, re.DOTALL)
        if not match:
            return []

    array_content = match.group(1).strip()
    entries = []

    # Robust parsing by splitting on indentation
    raw_blocks = array_content.split("    {")
    
    def extract_val(text, key, is_string=True, is_array=False):
        if is_array:
            p = re.compile(rf"{key}:\s*\[(.*?)\]", re.DOTALL)
            m = p.search(text)
            if m:
                raw = m.group(1)
                return [x.strip().strip('"').strip("'") for x in raw.split(",") if x.strip()]
            return []
        if is_string:
            p = re.compile(rf"{key}:\s*\"(.*?)\"", re.DOTALL)
        else:
            p = re.compile(rf"{key}:\s*([^\s,]+)", re.DOTALL)
        m = p.search(text)
        return m.group(1) if m else None

    def extract_solutions(text):
        match = re.search(r"solutions:\s*\{(.*?)\}", text, re.DOTALL)
        result = {}
        if match:
            inner = match.group(1)
            code_pattern = re.compile(r"(\w+):\s*`([^`]*)`", re.DOTALL)
            for cm in code_pattern.finditer(inner):
                result[cm.group(1)] = unescape_backticks(cm.group(2))
        return result

    for block in raw_blocks:
        if not block.strip() or "id:" not in block:
            continue
        block = "    {" + block # fix split
        
        entry = {
            "id": int(extract_val(block, "id", is_string=False) or 0),
            "title": extract_val(block, "title"),
            "link": extract_val(block, "link"),
            "tags": extract_val(block, "tags", is_array=True),
            "solutions": extract_solutions(block)
        }
        rating = extract_val(block, "rating", is_string=False)
        difficulty = extract_val(block, "difficulty")
        if rating: entry["rating"] = int(rating)
        if difficulty: entry["difficulty"] = difficulty
        entries.append(entry)

    return entries

def format_ts_export(export_name, data_list, platform, category_filename):
    type_name = "CFQuestionType" if platform in ["codeforces", "codechef"] else "QuestionType"
    import_path = f"../../pages/{platform}/{platform}"
    
    lines = [
        f"import type {{ {type_name} }} from \"{import_path}\";",
        "",
        f"export const {export_name}: {type_name}[] = [",
    ]
    
    for entry in data_list:
        lines.append("    {")
        lines.append(f"        id: {entry['id']},")
        lines.append(f"        title: \"{entry['title']}\",")
        lines.append(f"        link: \"{entry['link']}\",")
        
        tags_str = ", ".join([f"\"{t}\"" for t in entry.get("tags", [])])
        lines.append(f"        tags: [{tags_str}],")
        
        if "rating" in entry:
             lines.append(f"        rating: {entry['rating']},")
        if "difficulty" in entry:
             lines.append(f"        difficulty: \"{entry['difficulty']}\",")
             
        lines.append("        solutions: {")
        for lang, code in entry.get("solutions", {}).items():
            if code:
                lines.append(f"            {lang}: `{escape_backticks(code)}`,")
        lines.append("        },")
        lines.append("    },")
    
    lines.append("];")
    return "\n".join(lines)

# --- Main ---

def main():
    console.print(
        "[bold green]Codesolve Data Manager[/bold green] [yellow](Auto-Commenter Edition)[/yellow]\n"
    )

    platform = select_from_list("Select Platform", ALLOWED_PLATFORMS)
    
    if platform == "leetcode":
        rating_cat = select_from_list("Select Difficulty", ["easy", "medium", "hard"])
        category_file = rating_cat
        export_var_name = f"{rating_cat}Questions"
        difficulty_val = rating_cat.capitalize()
        rating_val = None
    else:
        rating_input = input("Enter rating (e.g., 800, 1000): ").strip()
        try:
            rating_num = int(rating_input)
        except ValueError:
            rating_num = 800
        category_file = str(rating_num)
        export_var_name = to_camel_case_var(rating_num)
        rating_val = rating_num
        difficulty_val = None

    filepath = build_output_path(platform, category_file)
    existing_entries = parse_existing_file(filepath)

    ques_title = input("Enter Question Title: ").strip()
    
    target_entry = None
    for entry in existing_entries:
        if entry["title"].lower() == ques_title.lower():
            target_entry = entry
            console.print(f"[yellow]Found existing entry for '{ques_title}'. Updating...[/yellow]")
            break
    
    if not target_entry:
        if existing_entries:
            suggested_id = max(e["id"] for e in existing_entries) + 1
        else:
            suggested_id = 1
        
        id_input = input(f"Enter ID (default {suggested_id}): ").strip()
        ques_id = int(id_input) if id_input.isdigit() else suggested_id
        
        ques_link = input("Enter Question Link: ").strip()
        tags_input = input("Enter Tags (comma separated): ").strip()
        tags_list = [t.strip() for t in tags_input.split(",") if t.strip()]
        
        target_entry = {
            "id": ques_id,
            "title": ques_title,
            "link": ques_link,
            "tags": tags_list,
            "solutions": {}
        }
        if rating_val: target_entry["rating"] = rating_val
        if difficulty_val: target_entry["difficulty"] = difficulty_val
        existing_entries.append(target_entry)

    # --- Code Input ---
    language_options = list(LANG_MAP.keys()) + ["all"]
    language_choice = select_from_list("Select Language to Add/Update", language_options)
    
    langs_to_process = []
    if language_choice == "all":
        langs_to_process = sorted(LANG_MAP.keys())
    else:
        langs_to_process = [language_choice]
        
    # To store which keys we just updated
    updated_keys = []

    for user_lang in langs_to_process:
        ts_key = get_lang_key(user_lang, platform)
        existing_code = target_entry["solutions"].get(ts_key, "")
        
        if existing_code and language_choice != "all":
             console.print(f"[dim]Existing code found for {ts_key}.[/dim]")
        
        prompt = f"Enter code for {ts_key} ({user_lang})"
        code = get_multiline_input(prompt)
        
        if code.strip():
            target_entry["solutions"][ts_key] = code
            updated_keys.append(ts_key)

    # --- Save Initial (Raw) Code ---
    ts_content = format_ts_export(export_var_name, existing_entries, platform, category_file)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(ts_content)
    console.print(f"\n[bold green]✅ Raw code saved to:[/bold green] {filepath}")

    # --- Gemini Commenting Feature ---
    if updated_keys:
        use_gemini = select_from_list("Use AI to add inline comments to the code?", ["yes", "no"])
        
        if use_gemini == "yes":
            for ts_key in updated_keys:
                original_code = target_entry["solutions"][ts_key]
                console.print(f"Adding comments to [bold cyan]{ts_key}[/bold cyan]...")
                
                commented_code = add_comments_to_code(original_code)
                
                # Update the entry with the new commented code
                target_entry["solutions"][ts_key] = commented_code
            
            # --- Save Commented Code ---
            ts_content = format_ts_export(export_var_name, existing_entries, platform, category_file)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(ts_content)
            
            console.print(f"\n[bold green]✅ Commented code updated successfully![/bold green]")

if __name__ == "__main__":
    main()