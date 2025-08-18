import os
import re
import inflect
import readchar
from rich.console import Console
from dotenv import load_dotenv

load_dotenv()

console = Console()

ALLOWED_PLATFORMS = ["leetcode", "codeforces", "codechef"]

ALLOWED_LANGUAGES = {
    "cpp": "solcpp",
    "java": "soljava",
    "python": "solpyth",
    "rust": "solrust",
}

# Add explanation keys
ALL_KEYS = {
    "solcpp": "",
    "expcpp": "",
    "soljava": "",
    "expjava": "",
    "solpyth": "",
    "exppyth": "",
    "solrust": "",
    "exprust": "",
}

# ------------------------------------------------------------
# Gemini prompt configuration (editable/customizable by you)
# ------------------------------------------------------------
PROMPT_CONFIG = """You are an expert programmer and technical writer.
Provide a step-by-step explanation for the following solution in plain markdown bullet points.

Follow these instructions strictly:
1. The explanation must be **concise** and in plain points.
2. Do **not** copy or quote lines from the original code.
3. Do **not** repeat or rephrase the code. Focus only on describing the logic in a high-level manner.
4. Do **not** use analogies or real-life examples.
5. Discuss the logic and high-level approach separately from the code implementation.
6. Do **not** use headings, bold text, or any form of formatting. Only use simple bullet points.
7. Do **not** start with phrases like "Here is the explanation" or "Of course".
8. The output must consist **only** of bullet points explaining the logic and idea behind the solution.

Here is the solution:

{code}
"""

MODEL_NAME = "models/gemini-2.5-pro"  # change later if Google updates it


def generate_explanation(code: str, prompt_config: str) -> str:
    from google.generativeai import GenerativeModel, configure

    configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = GenerativeModel(MODEL_NAME)
    prompt = prompt_config.format(code=code)

    response = model.generate_content(
        prompt, generation_config={"max_output_tokens": 1500}
    )

    # safely extract text
    if response.candidates and response.candidates[0].content.parts:
        return response.candidates[0].content.parts[0].text.strip()
    return ""


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


def get_multiline_input(end_marker="endloop"):
    console.print(f"[cyan]Enter your code (end with '{end_marker}'):[/cyan]")
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


def build_output_path(platform, category):
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    base_path = os.path.join(project_root, "frontend", "public", "data", platform)
    os.makedirs(base_path, exist_ok=True)
    return os.path.join(base_path, f"{category}.ts")


def parse_existing_file(filepath):
    if not os.path.exists(filepath):
        return []

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r"\[\s*(.*?)\s*\];", content, re.DOTALL)
    if not match:
        return []

    array_content = match.group(1).strip()
    entries = []

    pattern = re.compile(
        r'\{\s*quesname:\s*"([^"]+)",\s*'
        r'queslink:\s*"([^"]+)",\s*'
        r"soljava:\s*`([^`]*)`,\s*expjava:\s*`([^`]*)`,\s*"
        r"solcpp:\s*`([^`]*)`,\s*expcpp:\s*`([^`]*)`,\s*"
        r"solpyth:\s*`([^`]*)`,\s*exppyth:\s*`([^`]*)`,\s*"
        r"solrust:\s*`([^`]*)`,\s*exprust:\s*`([^`]*)`\s*\}",
        re.DOTALL,
    )

    for m in pattern.finditer(array_content):
        entries.append(
            {
                "quesname": m.group(1),
                "queslink": m.group(2),
                "soljava": m.group(3),
                "expjava": m.group(4),
                "solcpp": m.group(5),
                "expcpp": m.group(6),
                "solpyth": m.group(7),
                "exppyth": m.group(8),
                "solrust": m.group(9),
                "exprust": m.group(10),
            }
        )

    return entries


def number_to_words(num):
    p = inflect.engine()
    return p.number_to_words(num).replace("-", "_").replace(" ", "_")


def escape_backticks(text):
    return text.replace("`", "\\`")


def format_ts_export(export_name, data_list, platform, category):
    lines = [
        f"// This file contains {platform} {category} questions",
        "",
        f"export const {export_name} = [",
    ]
    for entry in data_list:
        lines.append("  {")
        lines.append(f'    quesname: "{entry["quesname"]}",')
        lines.append(f'    queslink: "{entry["queslink"]}",')
        for key in [
            "soljava",
            "expjava",
            "solcpp",
            "expcpp",
            "solpyth",
            "exppyth",
            "solrust",
            "exprust",
        ]:
            code_str = escape_backticks(entry[key]) if entry[key] else ""
            lines.append(f"    {key}: `{code_str}`,")
        lines.append("  },")
    lines.append("];")
    return "\n".join(lines)


def show_entries(entries):
    console.print("\n[bold magenta]📜 Current Entries:[/bold magenta]")
    for idx, e in enumerate(entries, start=1):
        console.print(
            f"[cyan]{idx}.[/cyan] {e['quesname']} - [blue]{e['queslink']}[/blue]"
        )


def main():
    console.print(
        "[bold green]Welcome to Codesolve!!![/bold green] [yellow](Interactive Edition)[/yellow]\n"
    )

    platform = select_from_list("Select Platform", ALLOWED_PLATFORMS)
    quesname = input("Enter question name (case sensitive): ").strip()
    queslink = input("Enter question link: ").strip()

    if platform == "leetcode":
        rating = select_from_list("Select Rating", ["easy", "medium", "hard"])
        category = rating
        export_name = f"leetcode_{rating}"
    else:
        rating = input("Enter numeric rating (e.g., 800, 1200): ").strip()
        rating_num = int(rating)
        lower_bound = (rating_num // 100) * 100
        category = str(lower_bound)
        export_name = number_to_words(lower_bound)

    language = select_from_list("Select Language", list(ALLOWED_LANGUAGES.keys()))
    code = get_multiline_input()

    filepath = build_output_path(platform, category)
    existing_entries = parse_existing_file(filepath)

    lang_key = ALLOWED_LANGUAGES[language]
    updated = False
    for entry in existing_entries:
        if entry["quesname"] == quesname and entry["queslink"] == queslink:
            entry[lang_key] = code
            updated = True
            break

    if not updated:
        new_entry = ALL_KEYS.copy()
        new_entry.update({"quesname": quesname, "queslink": queslink, lang_key: code})
        existing_entries.append(new_entry)

    # First save
    ts_content = format_ts_export(export_name, existing_entries, platform, category)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(ts_content)
    console.print(
        f"\n[bold green]✅ Solution saved successfully in:[/bold green] {filepath}"
    )

    use_gemini = select_from_list(
        "Generate Gemini explanation for this solution?", ["yes", "no"]
    )
    if use_gemini == "yes":
        for entry in existing_entries:
            if entry["quesname"] == quesname and entry["queslink"] == queslink:
                sol_key = ALLOWED_LANGUAGES[language]
                exp_key = "exp" + language
                explanation = generate_explanation(entry[sol_key], PROMPT_CONFIG)
                entry[exp_key] = explanation
                break

        ts_content = format_ts_export(export_name, existing_entries, platform, category)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(ts_content)
        console.print("[green]✅ Explanation added using Gemini.[/green]")


if __name__ == "__main__":
    main()
