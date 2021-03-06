const chalk = require('chalk')
const Generator = require('yeoman-generator')
const path = require('path')
const slugify = require('slugify')
const yosay = require('yosay')

module.exports = class extends Generator {
  constructor (...args) {
    super(...args)

    // load package
    this.pkg = require('../package.json')

    // set source root path to templates
    this.sourceRoot(path.join(__dirname, 'templates'))

    // init extension manifest data
    this.manifest = {
      permissions: {}
    }
  }

  prompting () {
    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'What would you like to call this extension?',
      default: this.appname
    }, {
      type: 'input',
      name: 'shortName',
      message: 'And how would you call it if you only had 12 characters (short_name)?',
      default: answers => answers.name.substr(0, 11).trim()
    }, {
      name: 'description',
      message: 'How would you like to describe this extension?',
      default: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }, {
      type: 'list',
      name: 'action',
      message: 'Would you like to use UI Action?',
      choices: [
        'No',
        'Browser',
        'Page'
      ]
    }, {
      type: 'list',
      name: 'overridePage',
      message: 'Would you like to override a chrome page?',
      choices: [
        'No',
        'Bookmarks Page',
        'History Page',
        'Newtab Page'
      ]
    }, {
      type: 'checkbox',
      name: 'uifeatures',
      message: 'Would you like more UI Features?',
      choices: [{
        value: 'options',
        name: 'Options Page',
        checked: false
      }, {
        value: 'devtoolsPage',
        name: 'Devtools Page',
        checked: false
      }, {
        value: 'contentscript',
        name: 'Content Scripts',
        checked: false
      }, {
        value: 'omnibox',
        name: 'Omnibox',
        checked: false
      }]
    }, {
      type: 'checkbox',
      name: 'permissions',
      message: 'Would you like to use permissions?',
      choices: [{
        value: 'bookmarks',
        name: 'Bookmarks',
        checked: false
      }, {
        value: 'browsingData ',
        name: 'BrowsingData ',
        checked: false
      }, {
        value: 'clipboardRead',
        name: 'ClipboardRead',
        checked: false
      }, {
        value: 'clipboardWrite',
        name: 'ClipboardWrite',
        checked: false
      }, {
        value: 'contentSettings',
        name: 'ContentSettings',
        checked: false
      }, {
        value: 'contextMenus',
        name: 'ContextMenus',
        checked: false
      }, {
        value: 'cookies',
        name: 'Cookies',
        checked: false
      }, {
        value: 'commands',
        name: 'Commands',
        checked: false
      }, {
        value: 'debugger',
        name: 'Debugger',
        checked: false
      }, {
        value: 'declarativeContent',
        name: 'DeclarativeContent',
        checked: false
      }, {
        value: 'history',
        name: 'History',
        checked: false
      }, {
        value: 'input',
        name: 'Input',
        checked: false
      }, {
        value: 'management',
        name: 'Management',
        checked: false
      }, {
        value: 'notifications',
        name: 'Notifications',
        checked: false
      }, {
        value: 'pageCapture',
        name: 'PageCapture',
        checked: false
      }, {
        value: 'proxy',
        name: 'Proxy',
        checked: false
      }, {
        value: 'tabs',
        name: 'Tabs',
        checked: false
      }, {
        value: 'tabCapture',
        name: 'TabCapture',
        checked: false
      }, {
        value: 'topSites',
        name: 'TopSites',
        checked: false
      }, {
        value: 'webNavigation',
        name: 'WebNavigation',
        checked: false
      }, {
        value: 'webRequest',
        name: 'WebRequest',
        checked: false
      }, {
        value: 'webRequestBlocking',
        name: 'WebRequestBlocking',
        checked: false
      }]
    }, {
      type: 'confirm',
      name: 'promo',
      default: false,
      message: 'Would you like to install promo images for the Chrome Web Store?'
    }]

    return this.prompt(prompts).then(function (answers) {
      const isChecked = (choices, value) => choices.indexOf(value) > -1

      // Meta
      this.appname = this.manifest.name = answers.name.replace(/"/g, '\\"')
      this.appShortName = this.manifest.shortName = answers.shortName.replace(/"/g, '\\"')
      this.appDescription = answers.description
      this.manifest.description = answers.description.replace(/"/g, '\\"')

      // UI Actions
      this.manifest.action = (answers.action === 'No') ? 0 : (answers.action === 'Browser') ? 1 : 2

      // UI Features
      this.manifest.options = isChecked(answers.uifeatures, 'options')
      this.manifest.devtoolsPage = isChecked(answers.uifeatures, 'devtoolsPage')
      this.manifest.omnibox = isChecked(answers.uifeatures, 'omnibox')
      this.manifest.contentscript = isChecked(answers.uifeatures, 'contentscript')

      // Permissions
      this.manifest.permissions.bookmarks = isChecked(answers.permissions, 'bookmarks')
      this.manifest.permissions.browsingData = isChecked(answers.permissions, 'browsingData')
      this.manifest.permissions.clipboardRead = isChecked(answers.permissions, 'clipboardRead')
      this.manifest.permissions.clipboardWrite = isChecked(answers.permissions, 'clipboardWrite')
      this.manifest.permissions.commands = isChecked(answers.permissions, 'commands')
      this.manifest.permissions.contentSettings = isChecked(answers.permissions, 'contentSettings')
      this.manifest.permissions.contextMenus = isChecked(answers.permissions, 'contextMenus')
      this.manifest.permissions.cookies = isChecked(answers.permissions, 'cookies')
      this.manifest.permissions.debugger = isChecked(answers.permissions, 'debugger')
      this.manifest.permissions.declarativeContent = isChecked(answers.permissions, 'declarativeContent')
      this.manifest.permissions.history = isChecked(answers.permissions, 'history')
      this.manifest.permissions.input = isChecked(answers.permissions, 'input')
      this.manifest.permissions.management = isChecked(answers.permissions, 'management')
      this.manifest.permissions.notifications = isChecked(answers.permissions, 'notifications')
      this.manifest.permissions.pageCapture = isChecked(answers.permissions, 'pageCapture')
      this.manifest.permissions.proxy = isChecked(answers.permissions, 'proxy')
      this.manifest.permissions.tabCapture = isChecked(answers.permissions, 'tabCapture')
      this.manifest.permissions.tabs = isChecked(answers.permissions, 'tabs')
      this.manifest.permissions.topSites = isChecked(answers.permissions, 'topSites')
      this.manifest.permissions.webNavigation = isChecked(answers.permissions, 'webNavigation')
      this.manifest.permissions.webRequest = isChecked(answers.permissions, 'webRequest')
      this.manifest.permissions.webRequestBlocking = isChecked(answers.permissions, 'webRequestBlocking')

      // Override a chrome page
      switch (answers.overridePage) {
        case 'Bookmarks Page':
          this.manifest.overridePage = true
          this.manifest.bookmarksPage = true
          break
        case 'History Page':
          this.manifest.overridePage = true
          this.manifest.historyPage = true
          break
        case 'Newtab Page':
          this.manifest.overridePage = true
          this.manifest.newtabPage = true
          break
        case 'No':
          this.manifest.overridePage = false
          break
      }

      // Promo images
      this.promo = answers.promo
    }.bind(this))
  }

  tasks () {
    this.fs.copy(
      this.templatePath('gulpfile.babel.js'),
      this.destinationPath('gulpfile.babel.js')
    )

    this.fs.copy(
      this.templatePath('tasks/**/*'),
      this.destinationPath('tasks')
    )
  }

  packageJSON () {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'), {
        name: slugify(this.appname),
        description: this.manifest.description
      }
    )
  }

  readme () {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'), {
        name: this.appname,
        description: this.appDescription
      }
    )
  }

  git () {
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    )

    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes')
    )
  }

  babelrc () {
    this.fs.copy(
      this.templatePath('babelrc'),
      this.destinationPath('.babelrc')
    )
  }

  promo () {
    if (!this.promo) {
      return
    }

    this.fs.copy(
      this.templatePath('babelrc'),
      this.destinationPath('.babelrc')
    )
    this.fs.copy(
      this.templatePath('promo/Chrome-Webstore-Icon_128x128.png'),
      this.destinationPath('promo/Chrome-Webstore-Icon_128x128.png')
    )
    this.fs.copy(
      this.templatePath('promo/Promo-Image-Large_920x680.png'),
      this.destinationPath('promo/Promo-Image-Large_920x680.png')
    )
    this.fs.copy(
      this.templatePath('promo/Promo-Image-Marquee_1400x560.png'),
      this.destinationPath('promo/Promo-Image-Marquee_1400x560.png')
    )
    this.fs.copy(
      this.templatePath('promo/Promo-Image-Small_440x280.png'),
      this.destinationPath('promo/Promo-Image-Small_440x280.png')
    )
    this.fs.copy(
      this.templatePath('promo/Screenshot_1280x800.png'),
      this.destinationPath('promo/Screenshot_1280x800.png')
    )
    this.fs.copy(
      this.templatePath('promo/Screenshot_640x400.png'),
      this.destinationPath('promo/Screenshot_640x400.png')
    )
  }

  editorConfig () {
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    )
  }

  typeScriptConfigs () {
    this.fs.copy(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json')
    )
    this.fs.copy(
      this.templatePath('tslint.json'),
      this.destinationPath('tslint.json')
    )
  }

  manifest () {
    var manifest = {}
    var permissions = []
    var items = []

    function buildJSONPart (part) {
      return JSON.stringify(part, null, 2).replace(/\n/g, '\n  ')
    }

      // add browser / page action field
    if (this.manifest.action > 0) {
      var action = {
        default_icon: {
          19: 'images/icon-19.png',
          38: 'images/icon-38.png'
        },
        default_title: '__MSG_browserActionTitle__',
        default_popup: 'pages/popup.html'
      }
      var title = (this.manifest.action === 1) ? 'browser_action' : 'page_action'
      manifest[title] = buildJSONPart(action)
    }

      // add options page field.
    if (this.manifest.options) {
      manifest.options_page = '"pages/options.html"'
      manifest.options_ui = buildJSONPart({
        'page': 'pages/options.html',
        'chrome_style': true
      })
    }

      // add devtool page field.
    if (this.manifest.devtoolsPage) {
      manifest.minimum_chrome_version = '"10.0"'
      manifest.devtools_page = '"pages/devtools.html"'
    }

      // Override Pages
    if (this.manifest.overridePage) {
        // add history page field.
      if (this.manifest.historyPage) {
        manifest.chrome_url_overrides = buildJSONPart({
          history: 'pages/history.html'
        })
      }

        // add bookmarks page field.
      if (this.manifest.bookmarksPage) {
        manifest.chrome_url_overrides = buildJSONPart({
          bookmarks: 'pages/bookmarks.html'
        })
      }

        // add newtab page field.
      if (this.manifest.newtabPage) {
        manifest.chrome_url_overrides = buildJSONPart({
          newtab: 'pages/newtab.html'
        })
      }
    }

      // add omnibox keyword field.
    if (this.manifest.omnibox) {
      manifest.omnibox = buildJSONPart({
        keyword: this.manifest.shortName
      })
    }

      // add contentscript field.
    if (this.manifest.contentscript) {
      const contentscript = [{
        matches: ['http://*/*', 'https://*/*'],
        css: ['styles/contentscript.css'],
        js: ['scripts/contentscript.js'],
        run_at: 'document_end',
        all_frames: false
      }]

      manifest.content_scripts = buildJSONPart(contentscript)
    }

      // add generate permission field.
    for (let p in this.manifest.permissions) {
      if (this.manifest.permissions[p]) {
        permissions.push(p)
      }
    }

      // add generic match pattern field.
    if (this.manifest.permissions.tabs) {
      permissions.push('<all_urls>')
    }

      // add permissions
    if (permissions.length > 0) {
      manifest.permissions = buildJSONPart(permissions)
    }

    for (let i in manifest) {
      items.push(['  "', i, '": ', manifest[i]].join(''))
    }

    this.manifest.items = (items.length > 0) ? ',\n' + items.join(',\n') : ''

    this.fs.copyTpl(
      this.templatePath('app/manifest.json'),
      this.destinationPath('app/manifest.json'), {
        items: this.manifest.items
      }
    )
  }

  actions () {
    if (this.manifest.action === 0) return

    this.fs.copy(
      this.templatePath('app/pages/popup.html'),
      this.destinationPath('app/pages/popup.html')
    )
    this.fs.copy(
      this.templatePath('app/scripts/popup.ts'),
      this.destinationPath('app/scripts/popup.ts')
    )
    this.fs.copy(
      this.templatePath('app/styles/popup.scss'),
      this.destinationPath('app/styles/popup.scss')
    )
    this.fs.copy(
      this.templatePath('app/images/icon-19.png'),
      this.destinationPath('app/images/icon-19.png')
    )
    this.fs.copy(
      this.templatePath('app/images/icon-38.png'),
      this.destinationPath('app/images/icon-38.png')
    )
  }

  backgroundpage () {
    let filename = 'background.ts'

    if (this.manifest.action === 2) {
      filename = 'background.pageaction.ts'
    } else if (this.manifest.action === 1) {
      filename = 'background.browseraction.ts'
    }

    this.fs.copy(
      this.templatePath(`app/scripts/${filename}`),
      this.destinationPath('app/scripts/background.ts')
    )
  }

  options () {
    if (!this.manifest.options) return

    this.fs.copy(
      this.templatePath('app/pages/options.html'),
      this.destinationPath('app/pages/options.html')
    )
    this.fs.copy(
      this.templatePath('app/scripts/options.ts'),
      this.destinationPath('app/scripts/options.ts')
    )
    this.fs.copy(
      this.templatePath('app/styles/options.scss'),
      this.destinationPath('app/styles/options.scss')
    )
  }

  devtools () {
    if (!this.manifest.devtoolsPage) return

    this.fs.copy(
      this.templatePath('app/pages/devtools.html'),
      this.destinationPath('app/pages/devtools.html')
    )
    this.fs.copy(
      this.templatePath('app/scripts/devtools.ts'),
      this.destinationPath('app/scripts/devtools.ts')
    )
    this.fs.copy(
      this.templatePath('app/styles/devtools.scss'),
      this.destinationPath('app/styles/devtools.scss')
    )
  }

  history () {
    if (!this.manifest.historyPage) return

    this.fs.copy(
      this.templatePath('app/pages/history.html'),
      this.destinationPath('app/pages/history.html')
    )
    this.fs.copy(
      this.templatePath('app/scripts/history.ts'),
      this.destinationPath('app/scripts/history.ts')
    )
    this.fs.copy(
      this.templatePath('app/styles/history.scss'),
      this.destinationPath('app/styles/history.scss')
    )
  }

  bookmarks () {
    if (!this.manifest.bookmarksPage) return

    this.fs.copy(
      this.templatePath('app/pages/bookmarks.html'),
      this.destinationPath('app/pages/bookmarks.html')
    )
    this.fs.copy(
      this.templatePath('app/scripts/bookmarks.ts'),
      this.destinationPath('app/scripts/bookmarks.ts')
    )
    this.fs.copy(
      this.templatePath('app/styles/bookmarks.scss'),
      this.destinationPath('app/styles/bookmarks.scss')
    )
  }

  newtab () {
    if (!this.manifest.newtabPage) return

    this.fs.copy(
      this.templatePath('app/pages/newtab.html'),
      this.destinationPath('app/pages/newtab.html')
    )
    this.fs.copy(
      this.templatePath('app/scripts/newtab.ts'),
      this.destinationPath('app/scripts/newtab.ts')
    )
    this.fs.copy(
      this.templatePath('app/styles/newtab.scss'),
      this.destinationPath('app/styles/newtab.scss')
    )
  }

  contentscript () {
    if (!this.manifest.contentscript) return

    this.fs.copy(
      this.templatePath('app/scripts/contentscript.ts'),
      this.destinationPath('app/scripts/contentscript.ts')
    )
    this.fs.copy(
      this.templatePath('app/styles/contentscript.scss'),
      this.destinationPath('app/styles/contentscript.scss')
    )
  }

  locales () {
    this.fs.copyTpl(
      this.templatePath('app/_locales/en/messages.json'),
      this.destinationPath('app/_locales/en/messages.json'), {
        name: this.manifest.name,
        shortName: this.manifest.shortName,
        description: this.manifest.description,
        action: this.manifest.action
      }
    )
  }

  assets () {
    this.fs.copy(
      this.templatePath('app/images/icon-16.png'),
      this.destinationPath('app/images/icon-16.png')
    )
    this.fs.copy(
      this.templatePath('app/images/icon-128.png'),
      this.destinationPath('app/images/icon-128.png')
    )
    this.fs.copy(
      this.templatePath('app/fonts/gitkeep'),
      this.destinationPath('app/fonts/.gitkeep')
    )
  }

  installing () {
    this.log('I\'m all done. Running ' + chalk.yellow('npm install') + ' for you to install the required dependencies. If this fails, try running the command yourself.')
    this.npmInstall()
  }

  end () {
    this.log(
      yosay('Please run ' + chalk.red('gulp') + ' or  ' + chalk.yellow('gulp --watch') + ' and load the generated dist into chrome.')
    )
  }
}
