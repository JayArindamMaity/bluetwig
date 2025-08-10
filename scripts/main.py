import os
import re
import inflect
import readchar
from rich.console import Console
from rich.text import Text

console = Console()

ALLOWED_PLATFORMS = ["leetcode", "codeforces", "codechef"]
ALLOWED_LANGUAGES = {"cpp": "solcpp", "java": "soljava", "python": "solpyth", "rust": "solrust"}


def select_from_list(title, options):
    """Interactive ↑/↓ menu selection without box borders."""
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
    # Always use project root as base
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    base_path = os.path.join(project_root, "frontend", "public", "data", platform)
    os.makedirs(base_path, exist_ok=True)
    return os.path.join(base_path, f"{category}.ts")


def parse_existing_file(filepath):
    if not os.path.exists(filepath):
        return []

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except OSError as e:
        console.print(f"[red]⚠ Could not read file:[/red] {e}")
        return []

    match = re.search(r"\[\s*(.*?)\s*\];", content, re.DOTALL)
    if not match:
        return []

    array_content = match.group(1).strip()
    if not array_content:
        return []

    entries = []
    pattern = re.compile(
        r'\{\s*quesname:\s*"([^"]+)",\s*'
        r'queslink:\s*"([^"]+)",\s*'
        r'soljava:\s*`([^`]*)`,\s*'
        r'solcpp:\s*`([^`]*)`,\s*'
        r'solpyth:\s*`([^`]*)`,\s*'
        r'solrust:\s*`([^`]*)`\s*\}',
        re.DOTALL,
    )

    for m in pattern.finditer(array_content):
        entries.append({
            "quesname": m.group(1),
            "queslink": m.group(2),
            "soljava": m.group(3),
            "solcpp": m.group(4),
            "solpyth": m.group(5),
            "solrust": m.group(6),
        })

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
        lines.append("    {")
        lines.append(f'        quesname: "{entry["quesname"]}",')
        lines.append(f'        queslink: "{entry["queslink"]}",')
        for lang in ["soljava", "solcpp", "solpyth", "solrust"]:
            code_str = escape_backticks(entry[lang]) if entry[lang] else ""
            lines.append(
                f'        {lang}: `{code_str}`,' if lang != "solrust" else f'        {lang}: `{code_str}`'
            )
        lines.append("    },")
    lines.append("];")
    return "\n".join(lines)


def show_entries(entries):
    console.print("\n[bold magenta]📜 Current Entries:[/bold magenta]")
    for idx, e in enumerate(entries, start=1):
        console.print(f"[cyan]{idx}.[/cyan] {e['quesname']} - [blue]{e['queslink']}[/blue]")


def main():
    console.print("[bold green]Welcome to Codesolve!!![/bold green] [yellow](Interactive Edition)[/yellow]\n")

    # Platform
    platform = select_from_list("Select Platform", ALLOWED_PLATFORMS)

    # Question name & link
    quesname = input("Enter question name (case sensitive): ").strip()
    queslink = input("Enter question link: ").strip()

    # Ratings
    if platform == "leetcode":
        rating = select_from_list("Select Rating", ["easy", "medium", "hard"])
        category = rating
        export_name = f"leetcode_{rating}"
    elif platform in ["codeforces", "codechef"]:
        rating = input("Enter numeric rating (e.g., 800, 1200): ").strip()
        try:
            rating_num = int(rating)
            lower_bound = (rating_num // 100) * 100
            category = str(lower_bound)
            export_name = number_to_words(lower_bound)
        except ValueError:
            console.print("[red]❌ Invalid numeric rating.[/red]")
            return

    # Language selection
    language = select_from_list("Select Language", list(ALLOWED_LANGUAGES.keys()))
    code = get_multiline_input()

    filepath = build_output_path(platform, category)
    existing_entries = parse_existing_file(filepath)

    # Update or append entry
    lang_key = ALLOWED_LANGUAGES[language]
    updated = False
    for entry in existing_entries:
        if entry["quesname"] == quesname and entry["queslink"] == queslink:
            entry[lang_key] = code
            updated = True
            break

    if not updated:
        new_entry = {k: "" for k in ALLOWED_LANGUAGES.values()}
        new_entry.update({"quesname": quesname, "queslink": queslink, lang_key: code})
        existing_entries.append(new_entry)

    # Save file
    ts_content = format_ts_export(export_name, existing_entries, platform, category)
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(ts_content)
        console.print(f"\n[bold green]✅ Solution saved successfully in:[/bold green] {filepath}")
    except OSError as e:
        console.print(f"[red]❌ Failed to write file:[/red] {e}")
        return

    # Show all entries after saving
    show_entries(existing_entries)


if __name__ == "__main__":
    main()