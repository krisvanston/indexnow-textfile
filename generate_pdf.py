import textwrap
from pathlib import Path

SOURCE_MD = Path("aphasia-companion-concept.md")
OUTPUT_PDF = Path("aphasia-companion-concept.pdf")

PAGE_WIDTH = 612  # 8.5 inches * 72 dpi
PAGE_HEIGHT = 792  # 11 inches * 72 dpi
MARGIN = 72
LEADING = 16  # line spacing
MAX_LINES_PER_PAGE = int((PAGE_HEIGHT - 2 * MARGIN) / LEADING)
FONT_SIZE = 12
FONT_RESOURCE = "/F1"


def read_markdown_lines():
    raw_lines = SOURCE_MD.read_text(encoding="utf-8").splitlines()
    formatted = []

    for line in raw_lines:
        stripped = line.rstrip()
        if not stripped:
            formatted.append("")
            continue

        if stripped.startswith("### "):
            text = stripped[4:].upper()
        elif stripped.startswith("## "):
            text = stripped[3:].upper()
        elif stripped.startswith("# "):
            text = stripped[2:].upper()
        elif stripped.startswith("- "):
            text = "\u2022 " + stripped[2:]
        else:
            prefix = ""
            rest = stripped
            if ". " in stripped[:4]:
                potential_num, remainder = stripped.split(". ", 1)
                if potential_num.isdigit():
                    prefix = f"{potential_num}. "
                    rest = remainder
            if prefix:
                wrapped = textwrap.wrap(
                    rest,
                    width=90,
                    initial_indent=prefix,
                    subsequent_indent=" " * len(prefix),
                )
                formatted.extend(wrapped or [prefix])
                continue
            formatted.append(stripped)
            continue

        wrapped = textwrap.wrap(
            text,
            width=90,
            subsequent_indent="  " if text.startswith("\u2022") else "",
        )
        formatted.extend(wrapped or [text])

    return formatted


def sanitize(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_pages(lines):
    pages = []
    current_commands = []
    lines_on_page = 0

    def start_new_page():
        return [
            "BT",
            f"{FONT_RESOURCE} {FONT_SIZE} Tf",
            f"{LEADING} TL",
            f"{MARGIN} {PAGE_HEIGHT - MARGIN} Td",
        ]

    for line in lines:
        if not current_commands:
            current_commands = start_new_page()
            lines_on_page = 0

        if lines_on_page >= MAX_LINES_PER_PAGE:
            current_commands.append("ET")
            pages.append(current_commands)
            current_commands = start_new_page()
            lines_on_page = 0

        if lines_on_page == 0:
            if line:
                current_commands.append(f"({sanitize(line)}) Tj")
            else:
                current_commands.append("T*")
            lines_on_page += 1
            continue

        if line:
            current_commands.append("T*")
            current_commands.append(f"({sanitize(line)}) Tj")
        else:
            current_commands.append("T*")
        lines_on_page += 1

    if current_commands:
        current_commands.append("ET")
        pages.append(current_commands)

    return pages


def build_pdf_objects(pages):
    num_pages = len(pages)
    if num_pages == 0:
        raise ValueError("No content to render")

    catalog_num = 1
    pages_num = 2
    page_obj_nums = [3 + i for i in range(num_pages)]
    content_obj_nums = [3 + num_pages + i for i in range(num_pages)]
    font_obj_num = 3 + num_pages * 2

    objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [{}] /Count {} >>".format(
            " ".join(f"{n} 0 R" for n in page_obj_nums), num_pages
        ),
    ]

    for idx, page_num in enumerate(page_obj_nums):
        content_ref = f"{content_obj_nums[idx]} 0 R"
        page_obj = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
            f"/Resources << /Font << /F1 {font_obj_num} 0 R >> >> "
            f"/Contents {content_ref} >>"
        )
        objects.append(page_obj)

    for commands in pages:
        stream = "\n".join(commands) + "\n"
        stream_bytes = stream.encode("utf-8")
        content_obj = (
            f"<< /Length {len(stream_bytes)} >>\n"
            "stream\n"
            f"{stream}"
            "endstream"
        )
        objects.append(content_obj)

    font_obj = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
    objects.append(font_obj)

    return objects


def write_pdf(objects):
    output = bytearray(b"%PDF-1.4\n")
    offsets = [0]

    for index, obj in enumerate(objects, start=1):
        offsets.append(len(output))
        obj_entry = f"{index} 0 obj\n{obj}\nendobj\n".encode("utf-8")
        output.extend(obj_entry)

    startxref = len(output)
    xref_lines = ["xref", f"0 {len(objects) + 1}", "0000000000 65535 f "]
    for offset in offsets[1:]:
        xref_lines.append(f"{offset:010d} 00000 n ")
    xref = "\n".join(xref_lines) + "\n"
    output.extend(xref.encode("ascii"))

    trailer = (
        "trailer\n"
        f"<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
        "startxref\n"
        f"{startxref}\n"
        "%%EOF\n"
    )
    output.extend(trailer.encode("ascii"))

    OUTPUT_PDF.write_bytes(output)


def main():
    lines = read_markdown_lines()
    pages = build_pages(lines)
    objects = build_pdf_objects(pages)
    write_pdf(objects)


if __name__ == "__main__":
    main()
