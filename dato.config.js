module.exports = (dato, root, i18n) => {
  i18n.availableLocales.forEach(lang => {
    i18n.withLocale(lang, () => {
      root.directory(`src/${lang}`, (rootDirectory) => {
        dato.qas.forEach((mainPage, index) => {
          rootDirectory.createPost(
            `${mainPage.slug}/index.md`, "yaml", {
              frontmatter: {
                question: mainPage.question,
                layout: 'index.html',
                locale: lang,
                index: index,
                slug: mainPage.slug,
                ...dato.configuration.data
              },
              content: mainPage.answer || ''
            }
          );
        });
      });
    });
  });
}