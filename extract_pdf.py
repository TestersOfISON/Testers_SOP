import PyPDF2

def extract_text():
    with open('Confluence En (1).pdf', 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ''
        for page_num in range(len(pdf_reader.pages)):
            text += f"--- Page {page_num + 1} ---\n"
            text += pdf_reader.pages[page_num].extract_text() + '\n'
    
    with open('confluence_en_extracted.txt', 'w', encoding='utf-8') as out_file:
        out_file.write(text)

if __name__ == "__main__":
    extract_text()
