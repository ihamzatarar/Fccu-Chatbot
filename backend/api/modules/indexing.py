import os
import PyPDF2
import os

print("Current working directory:", os.getcwd())

def extract_all_pdf_pages(directory: str) -> dict[str, list[str]]:
    pdf_texts = {}

    # Loop through each file in the directory
    for filename in os.listdir(directory):
        if filename.lower().endswith('.pdf'):
            pathname = os.path.join(directory, filename)
            parts = [f"--- START OF PDF {pathname} ---"]
            pages = []

            # Open the PDF file
            with open(pathname, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)

                # Extract text from each page
                for page in pdf_reader.pages:
                    text = page.extract_text()
                    if text:  # Ensuring that there is text extracted
                        pages.append(text)
                    else:
                        pages.append("No text found on this page.")

            # Append each page's text to the parts list with a header
            for index, page_text in enumerate(pages):
                parts.append(f"--- PAGE {index + 1} ---")
                parts.append(page_text)

            # Store the parts in the dictionary under the filename
            pdf_texts[filename] = parts

    return pdf_texts

