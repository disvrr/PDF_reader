pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const studentPattern =
  /^(.+?)\s+(не\s+розраховується|\d+(?:[.,]\d+)?)\s+([\p{L}]+\s*-\s*\d{2}\s*-\s*\d+)(?:\s+(після\s+терміну))?$/u;

const fileInput = document.getElementById("pdfFile");
const statusElement = document.getElementById("status");
const tableBody = document.getElementById("tableBody");
const countElement = document.getElementById("count");


//get pdf-file
fileInput.addEventListener('change', async (event) => {
  const file = fileInput.files[0];

  if (!file) return;

  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")) {
    statusElement.textContent = "Оберіть PDF-файл.";
    return;
  }
  if (file.size === 0) {
    statusElement.textContent = "Помилка: файл порожній.";
    return;
  }
  tableBody.replaceChildren();
  countElement.textContent = "Записів: 0";
  statusElement.textContent = "Read file...";


  // File API: read file
  try {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
    const records = await readPdf(pdf);
    if (records.length === 0) {
      statusElement.textContent =
        "Не вдалося знайти записи студентів у PDF.";
      return;
    }
    buildTable(records);

    statusElement.textContent =
      `Файл: ${file.name}. ` +
      `Сторінок: ${pdf.numPages}. ` +
      `Читання завершено.`;

  } catch (error) {
    console.error(error);

    statusElement.textContent =
      "Error of reading. Check file and connection to PDF.js.";
  }

});

async function readPdf(pdf) {
  const records = [];

  // 3. Обрабатываем каждую страницу. 
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();

    // Group text fragments by their vertical position.
    const lines = new Map();

    for (const item of content.items) {
      if (!item.str || !item.str.trim()) {
        continue;
      }

      const x = item.transform[4];
      const y = item.transform[5];

      // PDF coordinates may differ slightly for one line.
      const key = Math.round(y / 3) * 3;

      if (!lines.has(key)) {
        lines.set(key, []);
      }

      lines.get(key).push({
        x,
        text: item.str.trim()
      });
    }

    // Sort lines from top to bottom.
    const sortedLines = [...lines.entries()].sort((a, b) => b[0] - a[0]);

    for (const [, fragments] of sortedLines) {
      // Sort fragments from left to right.
      fragments.sort((a, b) => a.x - b.x);

      const text = fragments
        .map(fragment => fragment.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      console.log("PDF line:", text);

      const match = text.match(studentPattern);

      if (!match) {
        continue;
      }

      records.push({
        name: match[1],
        rating: match[2],
        group: match[3],
        additional: match[4] || ""
      });
    }
  }
  return records;
}

// Build table safely without inserting PDF text as HTML.
function buildTable(records) {
  const fragment = document.createDocumentFragment();

  records.forEach((record, index) => {
    const row = document.createElement("tr");

    const numberCell = document.createElement("td");
    numberCell.textContent = index + 1;

    const nameCell = document.createElement("td");
    nameCell.textContent = record.name;

    const ratingCell = document.createElement("td");
    ratingCell.textContent = record.rating;

    const groupCell = document.createElement("td");
    groupCell.textContent = record.group;

    const additionalCell = document.createElement("td");
    additionalCell.textContent = record.additional;

    row.append(
      numberCell,
      nameCell,
      ratingCell,
      groupCell,
      additionalCell
    );

    fragment.appendChild(row);
  });

  tableBody.replaceChildren(fragment);

  countElement.textContent =
    `Записів: ${records.length}`;
}



// const text = content.items
//   .map(item => item.str)
//   .join(" ")
//   .replace(/\s+/g, " ")
//   .trim();

// const tableHeader = /^П\.І\.Б\.\s+Рейтинг\s+Група\s+Додаткова\s+інформація$/;
// const tableContent =
//   /([\p{L}'’ʼ-]+(?:\s+[\p{L}'’ʼ-]+)*)\s+(не\s+розраховується|\d+(?:[.,]\d+)?)\s+([A-ZА-ЯІЇЄҐ]+)\s*-\s*(\d+)\s*-\s*(\d+)(?:\s*\(([^)]+)\))?(?:\s+(після\s+терміну))?/giu;

// const header = "інформація";
// const headerIndex = text.indexOf(header);

// const studentsText = headerIndex !== -1
//   ? text.slice(headerIndex + header.length)
//   : text;
// const matches = [...studentsText.matchAll(tableContent)];

// console.log("Количество найденных записей:", matches.length);
// console.log(matches);


// for (const item of content.items) {
//   if (item.match(tableHeader)) {
//     records.push({ item });
//   }
//   ifelse(item.match(tableContent)){

//     records.push({ item });
//   }

// }


//  const lines = new Map();
// for (const i of content.item) {
//   if () {
//     newLine = true;
//   }

// }


