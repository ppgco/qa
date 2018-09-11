module.exports = (dato, root, i18n) => {
  i18n.availableLocales.forEach(lang => {
    i18n.withLocale(lang, () => {
      root.directory(`src/`, (rootDirectory) => {
        dato.qas.forEach(mainPage => {
          rootDirectory.createPost(
            `${mainPage.slug}/index.md`, "yaml", {
              frontmatter: {
                question: mainPage.question,
                layout: 'index.html',
                locale: lang
              },
              content: mainPage.answer || ''
            }
          );
        });
      });
    });
  });
}