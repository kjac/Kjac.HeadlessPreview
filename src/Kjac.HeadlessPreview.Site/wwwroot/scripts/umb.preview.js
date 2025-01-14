const umbPreviewMessage = (category, value) => window.parent.postMessage(`umb.preview|${category}|${value}`, "*");

window.onload = () => {
    if (window.parent === window) {
        console.warn('No parent window found, umb.preview is disabled');
        return;
    }

    const elements = document.querySelectorAll('*[umb-preview-edit]')
    if (!elements.length) {
        // nothing to edit here - tell Umbraco we're ready
        umbPreviewMessage('init', 'ready');
        return;
    }

    // this prevents (most) hydration warnings from Next.js
    setTimeout(
        () => {
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                .umb-preview-edit:hover {
                    cursor: pointer;
                    box-shadow: inset 0px 0px 0px 2px rgb(27, 38, 79);
                }
            `;
            document.head.appendChild(styleSheet)

            elements.forEach(element => {
                const propertyAlias = element.getAttribute('umb-preview-edit');
                if (!propertyAlias) {
                    // no alias to edit
                    return;
                }
                element.classList.add('umb-preview-edit')
                element.title = `Click to edit this`;
                element.addEventListener('click', () => umbPreviewMessage('edit', propertyAlias));
            });

            // tell Umbraco we're ready
            umbPreviewMessage('init', 'ready');
        },
        500
    )
}

window.addEventListener(
    'message',
    (message) => {
        if (typeof message.data === 'string' && message.data.indexOf('umb.preview') === 0) {
            const parts = message.data.split('|');
            if (parts.length === 3 && parts[1] === 'scrollTo') {
                const coordinates = parts[2].split(',');
                window.scrollTo(Number(coordinates[0]), Number(coordinates[1]));
            }
        }
    },
    false);

window.addEventListener(
    'scrollend',
    () => umbPreviewMessage('scrollPos', `${window.scrollX},${window.scrollY}`),
    false
);
