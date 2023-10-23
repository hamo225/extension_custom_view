import { parseString as parseXmlString } from "xml2js";

interface DocumentTitle {
  label: string;
  line: number;
  column: number;
}

function parsedXml(xmlContent: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parseXmlString(xmlContent, (err: any, result: any) => {
      if (err) {
        console.log("error parsing");
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function extractDocTitle(
  parsedXmlContent: any
): DocumentTitle | null | undefined {
  let documentTitle: DocumentTitle | null = null;

  const aknAkomaNtoso = parsedXmlContent["akn:akomaNtoso"];
  if (aknAkomaNtoso) {
    let docOrBill = aknAkomaNtoso["akn:doc"] || aknAkomaNtoso["akn:bill"];
    if (Array.isArray(docOrBill) && docOrBill.length > 0) {
      const preface = docOrBill[0]["akn:preface"];
      if (Array.isArray(preface) && preface.length > 0) {
        const longTitle = preface[0]["akn:longTitle"];
        if (Array.isArray(longTitle) && longTitle.length > 0) {
          const pElements = longTitle[0]["akn:p"];
          if (Array.isArray(pElements) && pElements.length > 0) {
            for (const pElement of pElements) {
              const docTitleElement = pElement["akn:docTitle"];
              if (docTitleElement && docTitleElement.length > 0) {
                documentTitle = {
                  label: docTitleElement[0],
                  line: 78,
                  column: 0,
                };
                break;
              }
            }
          }
        }
      }
    }

    console.log("Document Title:", documentTitle);
    return documentTitle;
  }
}

export { parsedXml, extractDocTitle };
