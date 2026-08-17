import mammoth from "mammoth";

// pdf-parse has a quirky default export that tries to read a test file
// when required directly in some setups - importing the lib path avoids that.
import pdfParse from "pdf-parse/lib/pdf-parse.js";

const SUPPORTED_TYPES = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export function isSupportedFile(mimetype) {
  return Boolean(SUPPORTED_TYPES[mimetype]);
}

/**
 * Extracts plain text from an uploaded resume file buffer.
 * @param {Buffer} buffer - raw file bytes from multer
 * @param {string} mimetype - the uploaded file's mimetype
 * @returns {Promise<string>} extracted text
 */
export async function extractResumeText(buffer, mimetype) {
  const type = SUPPORTED_TYPES[mimetype];

  if (type === "pdf") {
    let data;
    try {
      data = await pdfParse(buffer);
    } catch (err) {
      throw new Error(
        "This PDF couldn't be read - it may be corrupted or use an unusual export format. Try re-exporting it or pasting the text instead."
      );
    }
    const text = (data.text || "").trim();
    if (!text) {
      throw new Error(
        "Couldn't read any text from that PDF. It may be a scanned image rather than a text-based PDF - try pasting the text instead."
      );
    }
    return text;
  }

  if (type === "docx") {
    let value;
    try {
      ({ value } = await mammoth.extractRawText({ buffer }));
    } catch (err) {
      throw new Error(
        "This Word document couldn't be read - it may be corrupted. Try re-saving it or pasting the text instead."
      );
    }
    const text = (value || "").trim();
    if (!text) {
      throw new Error("Couldn't read any text from that Word document.");
    }
    return text;
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
}
