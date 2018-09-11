const Metalsmith = require("metalsmith");
const sitemap = require('metalsmith-sitemap');
const less = require('metalsmith-less');
const ignore = require('metalsmith-ignore');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const collections = require('metalsmith-collections');
const env = require('metalsmith-env');
const cleanCSS = require('metalsmith-clean-css');
const htmlMinifier = require('metalsmith-html-minifier');
const Handlebars = require('handlebars');
const assets = require('metalsmith-assets');

Handlebars.registerHelper("link", function(value, locale, opts) {
  if (!value)
    return;

  if (value.indexOf('http') !== -1)
    return value;

  if (locale && typeof locale !== 'object')
    return '/' + locale + '/' + (value || '').replace('index.md', '').replace('index.html', '');

  return (value || '').replace('index.md', '').replace('index.html', '');
});

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('each', function(list, locale, limit, opts) {
  list = list || [];

  if (typeof locale === 'object') {
    opts = locale;
  }

  if (typeof limit === 'object') {
    opts = limit;
  }

  if (typeof locale === 'string') {
    list = list.filter(item => item.locale === locale);
  }

  if (typeof limit === 'number') {
    list = list.slice(0, limit);
  }

  return list.reduce((concated, item) => {
    concated += opts.fn(item);
    return concated;
  }, '');

});

const config = {
  clean: false,
  source: './src/',
  destination: './release',
  sitemap: {
    hostname: "https://subscribers.pushpushgo.com/"
  },
  cssmin: {
    files: 'assets/styles/*.css',
    cleanCSS: {
      rebase: true
    }
  },
  assets: {
    "source": "./assets",
    "destination": "."
  },
  meta: {
    title: "PushPushGo - Subscribers knowledge center",
    keywords: 'knowledge, subscribers, webpush, push, notifications, email, marketing, solution, saas, powiadomienia web push, notyfikacje, aplikacja, narzędzie, powiadomienia na stronie, offbrowser, desktop, mobile, message, wiadomości dla użytkowników, pushpushgo',
    description: "Solve your problems today! PushPushGo Subscriber knowledge center",
    url: "https://subscribers.pushpushgo.com/"
  },
  layouts: {
    engine: 'handlebars',
    directory: 'layouts'
  },
  less: {
    pattern: '**/main.less',
    render: {
      paths: [
        'assets/styles/',
      ],
    },
  },
  ignore: [
    '**/*.less'
  ],
  collections: {
    faq: {
      pattern: '**/*.md',
      sortBy: 'index',
      reverse: false
    }
  }
}

const app = Metalsmith(__dirname)
  .metadata(config.meta)
  .source(config.source)
  .destination(config.destination)
  .clean(config.clean)
  .use(env())
  .use(assets(config.assets))
  .use(less(config.less))
  .use((files, metalsmith, done) => {
    metalsmith._metadata.collections = null
    metalsmith._metadata.faq = null
    done();
  })
  .use(collections(config.collections))
  .use(markdown())
  .use(layouts(config.layouts))
  .use(cleanCSS(config.cssmin))
  .use(htmlMinifier())

if (module.parent) {
  module.exports = app
} else {
  app
    .use(sitemap(config.sitemap))
    .use(ignore(config.ignore))
    .build(function(err) {
      if (err) console.log(err.stack)
    })
}
