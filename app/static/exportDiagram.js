
const imageUrlToBase64 = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${url}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export const exportDiagram = async (output) => {
    const svg = document.getElementById("svg").innerHTML;
    const parser = new DOMParser();
    const parsedSVG = parser.parseFromString(svg, "image/svg+xml")
    const title = parsedSVG.querySelector("title").textContent;
    const images = parsedSVG.querySelectorAll("image");


    const processImages = async () => {
        const imagePromises = Array.from(images).map(async (image) => {
            const base64 = await imageUrlToBase64(image.getAttribute("xlink:href"));
            image.setAttribute("xlink:href", base64);
        });
        await Promise.all(imagePromises);
    }

    await processImages()
    const svgString = new XMLSerializer().serializeToString(parsedSVG.documentElement);


    if (output === "svg") {
        const blob = new Blob([svgString], { type: "image/svg+xml" })
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a")
        link.download = `${title}.svg`
        link.href = url
        link.click()
    }

    if (output === "png") {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.height = document.querySelector("svg").height.baseVal.value
        canvas.width = document.querySelector("svg").width.baseVal.value

        const svgBase64 = "data:image/svg+xml;base64," + btoa(svgString)

        const img = new Image()
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            const png = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = png;
            link.download = `${title}.png`;
            link.click();
        };
        img.src = svgBase64;
    }

}
