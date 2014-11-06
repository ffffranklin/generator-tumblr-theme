(function(b) {
    var Handlebars = {
        compilerCache: {},

        compile: function(d) {
            if (Handlebars.compilerCache[d] == null) {
                var fnBody = Handlebars.compileFunctionBody(d);
                var fn = new Function("context", "fallback", "Handlebars", fnBody);
                Handlebars.compilerCache[d] = function(context, fallback) {
                    return fn(context, fallback, Handlebars)
                }
            }
            return Handlebars.compilerCache[d]
        },

        compileToString: function(d) {
            var e = Handlebars.compileFunctionBody(d);
            return "function(context, fallback) { " + e + "}"
        },

        compileFunctionBody: function(d) {
            var e = new Handlebars.Compiler(d);
            e.compile();
            return "fallback = fallback || {}; var stack = [];" + e.fn
        },

        isFunction: function(d) {
            return Object.prototype.toString.call(d) == "[object Function]"
        },

        trim: function(d) {
            return d.replace(/^\s+|\s+$/g, "")
        },

        escapeText: function(d) {
            d = d.replace(/'/g, "\\'");
            d = d.replace(/\"/g, '\\"');
            return d
        },

        escapeExpression: function(d) {
            if (d instanceof Handlebars.SafeString) {
                return d.toString()
            } else {
                if (d === null) {
                    d = ""
                }
            }
            return d.toString().replace(/&(?!\w+;)|["\\<>]/g, function(e) {
                switch (e) {
                    case "&":
                        return "&amp;";
                        break;
                    case '"':
                        return '"';
                    case "\\":
                        return "\\\\";
                        break;
                    case "<":
                        return "&lt;";
                        break;
                    case ">":
                        return "&gt;";
                        break;
                    default:
                        return e
                }
            })
        },

        compilePartial: function(d) {
            if (Handlebars.isFunction(d)) {
                compiled = d
            } else {
                compiled = Handlebars.compile(d)
            }
            return compiled
        },

        evalExpression: function(h, f, d) {
            var k = Handlebars.parsePath(h);
            var j = k[0];
            var g = k[1];
            if (j > d.length) {
                f = null
            } else {
                if (j > 0) {
                    f = d[d.length - j]
                }
            }
            for (var e = 0; e < g.length && f !== undefined; e++) {
                f = f[g[e]]
            }
            return f
        },

        buildContext: function(f, d) {
            var e = function(g) {
                this.__stack__ = g.slice(0);
                this.__get__ = function(h) {
                    return Handlebars.evalExpression(h, this, this.__stack__)
                }
            };
            e.prototype = f;
            return new e(d)
        },

        pathPatterns: {},

        parsePath: function(k) {
            if (k == null) {
                return [0, []]
            } else {
                if (Handlebars.pathPatterns[k] != null) {
                    return Handlebars.pathPatterns[k]
                }
            }
            var h = k.split("/");
            var m = false;
            var l = 0;
            var f = [];
            for (var g = 0, e = h.length; g < e; g++) {
                switch (h[g]) {
                    case "..":
                        if (m) {
                            throw new Handlebars.Exception("Cannot jump out of context after moving into a context.")
                        } else {
                            l += 1
                        }
                        break;
                    case ".":
                    case "this":
                        break;
                    default:
                        m = true;
                        f.push(h[g])
                }
            }
            var d = [l, f];
            Handlebars.pathPatterns[k] = d;
            return d
        },

        isEmpty: function(d) {
            if (typeof d === "undefined") {
                return true
            } else {
                if (!d) {
                    return true
                } else {
                    if (Object.prototype.toString.call(d) === "[object Array]" && d.length == 0) {
                        return true
                    } else {
                        return false
                    }
                }
            }
        },

        filterOutput: function(e, d) {
            if (Handlebars.isEmpty(e)) {
                return ""
            } else {
                if (d) {
                    return Handlebars.escapeExpression(e)
                } else {
                    return e
                }
            }
        },

        handleBlock: function(i, g, d, h, e) {
            var f = "";
            if (Handlebars.isFunction(i)) {
                f = f + i.call(g, d, h);
                if (e != null && Handlebars.isFunction(i.not)) {
                    f = f + i.not.call(g, d, e)
                }
            } else {
                if (!Handlebars.isEmpty(i)) {
                    f = f + Handlebars.helperMissing.call(d, i, h)
                }
                if (e != null) {
                    f = f + Handlebars.helperMissing.not.call(d, i, e)
                }
            }
            return f
        },

        handleExpression: function(h, g, d, e) {
            var f = "";
            if (Handlebars.isFunction(h)) {
                f = f + Handlebars.filterOutput(h.call(g, d), e)
            } else {
                if (!Handlebars.isEmpty(h)) {
                    f = f + Handlebars.filterOutput(h, e)
                }
            }
            return f
        },

        handleInvertedSection: function(g, e, f) {
            var d = "";
            if (Handlebars.isFunction(g) && Handlebars.isEmpty(g())) {
                d = d + f(e)
            } else {
                if (Handlebars.isEmpty(g)) {
                    d = d + f(e)
                }
            }
            return d
        }
    };
    Handlebars.Compiler = function(d) {
        this.string = d;
        this.pointer = -1;
        this.mustache = false;
        this.text = "";
        this.fn = "var out = ''; var lookup; ";
        this.newlines = "";
        this.comment = false;
        this.escaped = false;
        this.partial = false;
        this.inverted = false;
        this.endCondition = null;
        this.continueInverted = false
    };
    Handlebars.Exception = function(d) {
        this.message = d
    };
    Handlebars.SafeString = function(d) {
        this.string = d
    };
    Handlebars.SafeString.prototype.toString = function() {
        return this.string.toString()
    };
    Handlebars.helperMissing = function(f, h) {
        var e = "";
        if (f === true) {
            return h(this)
        } else {
            if (f === false) {
                return ""
            } else {
                if (Object.prototype.toString.call(f) === "[object Array]") {
                    for (var g = 0, d = f.length; g < d; g++) {
                        e = e + h(f[g])
                    }
                    return e
                } else {
                    return h(f)
                }
            }
        }
    };
    Handlebars.helperMissing.not = function(d, e) {
        return e(d)
    };
    Handlebars.Compiler.prototype = {

        getChar: function(e) {
            var d = this.peek(e);
            this.pointer = this.pointer + (e || 1);
            return d
        },

        peek: function(e) {
            e = e || 1;
            var d = this.pointer + 1;
            return this.string.slice(d, d + e)
        },

        compile: function(e) {
            if (!e || !e(this)) {
                var d;
                while (d = this.getChar()) {
                    if (d === "{" && !this.mustache) {
                        this.parseMustache()
                    } else {
                        if (d === "\n") {
                            this.newlines = this.newlines + "\n";
                            d = "\\n"
                        } else {
                            if (d === "\r") {
                                this.newlines = this.newlines + "\r";
                                d = "\\r"
                            } else {
                                if (d === "\\") {
                                    d = "\\\\"
                                }
                            }
                        }
                        this.text = this.text + d
                    }
                    if (e && this.peek(3) == "{^}") {
                        this.continueInverted = true;
                        this.getChar(3);
                        break
                    } else {
                        if (e && e(this)) {
                            break
                        }
                    }
                }
            }
            this.addText();
            this.fn += "return out;";
            return
        },

        addText: function() {
            if (this.text) {
                this.fn = this.fn + 'out = out + "' + Handlebars.escapeText(this.text) + '"; ';
                this.fn = this.fn + this.newlines;
                this.newlines = "";
                this.text = ""
            }
        },

        addExpression: function(d, f) {
            f = f || null;
            var e = this.lookupFor(d);
            this.fn += "var proxy = Handlebars.buildContext(context, stack);";
            this.fn += "out = out + Handlebars.handleExpression(" + e + ", proxy, " + f + ", " + this.escaped + ");"
        },

        addInvertedSection: function(g) {
            var f = this.compileToEndOfBlock(g);
            var d = f.fn;
            var e = "fn" + this.pointer.toString();
            this.fn += "var " + e + " = function(context) {" + d + "}; ";
            this.fn += "lookup = " + this.lookupFor(g) + "; ";
            this.fn += "out = out + Handlebars.handleInvertedSection(lookup, context, " + e + ");";
            this.openBlock = false;
            this.inverted = false
        },

        lookupFor: function(g) {
            var d = Handlebars.parsePath(g);
            var f = d[0];
            var e = d[1];
            if (f > 0 || e.length > 1) {
                return "(Handlebars.evalExpression('" + g + "', context, stack))"
            } else {
                if (e.length == 1) {
                    return "(context['" + e[0] + "'] || fallback['" + e[0] + "'])"
                } else {
                    return "(context || fallback)"
                }
            }
        },

        compileToEndOfBlock: function(e) {
            var d = new Handlebars.Compiler(this.string.slice(this.pointer + 1));
            d.compile(function(f) {
                if (f.peek(8) === "{/block:") {
                    if (f.peek(e.length + 3) === "{/" + e + "}") {
                        f.getChar(e.length + 3);
                        return true
                    } else {
                        throw new Handlebars.Exception("Mismatched block close: expected " + e + ".")
                    }
                }
            });
            this.pointer += d.pointer + 1;
            return d
        },

        addBlock: function(h, j, i) {
            var g = this.compileToEndOfBlock(h);
            var d = g.fn;
            var f = "fn" + this.pointer.toString();
            this.fn += "var wrappedContext = Handlebars.buildContext(context, stack);";
            this.fn += "stack.push(context);";
            this.fn += "var " + f + " = function(context) {" + d + "}; ";
            this.fn += "lookup = " + this.lookupFor(h) + "; ";
            if (g.continueInverted) {
                var e = this.compileToEndOfBlock(h);
                this.fn += " var " + f + "Not = function(context) { " + e.fn + " };"
            } else {
                this.fn += " var " + f + "Not = null;"
            }
            this.fn += "out = out + Handlebars.handleBlock(lookup, wrappedContext, " + j + ", " + f + ", " + f + "Not);";
            this.fn += "stack.pop();";
            this.openBlock = false
        },

        addPartial: function(d, e) {
            this.fn += "if (typeof fallback['partials'] === 'undefined' || typeof fallback['partials']['" + d + "'] === 'undefined') throw new Handlebars.Exception('Attempted to render undefined partial: " + d + "');";
            this.fn += "out = out + Handlebars.compilePartial(fallback['partials']['" + d + "'])(" + e + ", fallback);"
        },

        /** customized for themr **/
        parseMustache: function() {
            var g, d, h, j, k;
            var next = this.peek();
            if (next === "!") {
                this.comment = true;
                this.getChar()
            } else if (this.peek(5) === "lang:") {
                this.openBlock = false;
                this.getChar(5);
                k = true
            } else if (this.peek(6) === "block:") {
                this.openBlock = true;
                this.getChar(6)
            } else if (next === ">") {
                this.partial = true;
                this.getChar()
            } else if (next === "^") {
                this.inverted = true;
                this.openBlock = true;
                this.getChar()
            } else if (next === "{" || next === "&") {
                this.escaped = false;
                this.getChar()
            }
            this.addText();
            this.mustache = " ";
            while (g = this.getChar()) {
                if (this.mustache && g === "}") {
                    var e = this.mustache;
                    var i = Handlebars.trim(this.mustache).split(/\s+/);
                    h = i[0];
                    j = this.lookupFor(i[1]);
                    this.mustache = false;
                    if (!this.escaped && this.peek() === "}") {
                        this.getChar()
                    }
                    if (k) {
                        this.text = e;
                        return
                    } else {
                        if (this.comment) {
                            this.comment = false;
                            return
                        } else {
                            if (this.partial) {
                                this.addPartial(h, j);
                                this.partial = false;
                                return
                            } else {
                                if (this.inverted) {
                                    this.addInvertedSection(h);
                                    this.inverted = false;
                                    return
                                } else {
                                    if (this.openBlock) {
                                        this.addBlock("block:" + h, j, i);
                                        return
                                    } else {
                                        return this.addExpression(h, j)
                                    }
                                }
                            }
                        }
                    }
                    this.escaped = true
                } else {
                    if (this.comment) {
                    } else {
                        this.mustache = this.mustache + g
                    }
                }
            }
        }
    };
    var exports = exports || {};
    exports.compile = Handlebars.compile;
    exports.compileToString = Handlebars.compileToString;
    Sammy = Sammy || {};
    Sammy.Handlebars = function(g, e) {
        var f = {};
        var d = function(k, l, i, h) {
            if (typeof h == "undefined") {
                h = k
            }
            var j = f[h];
            if (!j) {
                j = f[h] = Handlebars.compile(k)
            }
            l = b.extend({}, this, l);
            i = b.extend({}, l.partials, i);
            return j(l, {partials: i})
        };
        if (!e) {
            e = "handlebars"
        }
        g.helper(e, d)
    }
})(jQuery);

$.noConflict();

(function($) {

    var TumblrThemr = {
        config: {
            url: "tumblrthemr.tumblr.com",
            theme: "demo"
        },
        $loading: null,
        $config: null,
        $error: null,
        cache: {}
    };

    TumblrThemr.app = $.sammy(function() {
        this.element_selector = "#tumblrthemr-target";
        this.use(Sammy.Handlebars, "tumblr");
        this.get("", function(c) {
            this.redirect("#/")
        });
        this.get("#/", function(c) {
            c.partial("app/intro.tumblr");
            $("html").addClass("tumblrthemr-start");
            TumblrThemr.showConfig(null, true);
            TumblrThemr.hideLoading(null, true)
        });
        this.get(/\#\/url\/(.*)/, function(d) {
            $("html").removeClass("tumblrthemr-start");
            $("#tumblrthemr-error").hide();
            if (d.params.splat[0] != "") {
                TumblrThemr.config.theme = 'theme';
                var c = d.params.splat[0];
                TumblrThemr.config.url = c;
                if (typeof TumblrThemr.cache[c] !== "undefined" && TumblrThemr.cache[c] !== null) {
                    TumblrThemr.render(d, TumblrThemr.cache[c])
                } else {
                    // $.ajax({url: "http://tumblrxmltojson.icelab.com.au/content/" + c + "?callback=?",dataType: "json",success: function(e) {
                    $.ajax({url: "http://" + window.location.hostname + ":8080/content/" + c + "?callback=?",dataType: "json",success: function(e) {
                        TumblrThemr.cache[c] = e;
                        TumblrThemr.render(d, e)
                    },error: function(e, f) {
                        TumblrThemr.throwError("Failed to load JSON data from Tumblr. Have you installed the XML theme?");
                        d.redirect("#/")
                    }})
                }
                TumblrThemr.syncConfig()
            }
        });
        this.bind("lookup-route", function(d, c) {
            TumblrThemr.showLoading()
        });
        this.bind("changed", function(d, c) {
            $(document).trigger("ready");
            $(window).trigger("load");
            window.scrollTo(0, 0)
        })
    });
    TumblrThemr.render = function(c, d) {
        c["block:tumblrThemr"] = d;
        c.partial("theme.tumblr");
        TumblrThemr.hideLoading()
    };
    TumblrThemr.throwError = function(c) {
        TumblrThemr.$error.text(c);
        $("#tumblrthemr-error").show()
    };
    TumblrThemr.saveConfig = function(g) {
        g.preventDefault();
        var d = $("input[name=url]", TumblrThemr.$config).val();
        var f = $("input[name=theme]", TumblrThemr.$config).val();
        if (d == "" || f == "") {
            TumblrThemr.throwError("Sorry, you need to set both fields.");
            return false
        }
        TumblrThemr.config.url = d;
        TumblrThemr.config.theme = f;
        window.location.hash = "/url/" + TumblrThemr.config.url;
        var c = ($("html").hasClass("tumblrthemr-start")) ? true : false;
        TumblrThemr.hideConfig(g, c);
        $("html").removeClass("tumblrthemr-start")
    };
    TumblrThemr.syncConfig = function() {
        $("input[name=url]", TumblrThemr.$config).val(TumblrThemr.config.url);
        $("input[name=theme]", TumblrThemr.$config).val(TumblrThemr.config.theme)
    };
    TumblrThemr.showConfig = function(d, c) {
        if (d) {
            d.preventDefault()
        }
        if (c) {
            TumblrThemr.$config.show()
        } else {
            TumblrThemr.$config.slideDown()
        }
    };
    TumblrThemr.hideConfig = function(d, c) {
        if (d) {
            d.preventDefault()
        }
        if (c) {
            TumblrThemr.$config.hide()
        } else {
            TumblrThemr.$config.slideUp()
        }
    };
    TumblrThemr.showLoading = function(d, c) {
        if (d) {
            d.preventDefault()
        }
        if (c) {
            TumblrThemr.$loading.animate({top: 0}, 0)
        } else {
            TumblrThemr.$loading.animate({top: 0}, 400)
        }
    };
    TumblrThemr.hideLoading = function(d, c) {
        if (d) {
            d.preventDefault()
        }
        if (c) {
            TumblrThemr.$loading.animate({top: -34}, 0)
        } else {
            TumblrThemr.$loading.animate({top: -34}, 400)
        }
    };
    TumblrThemr.toAbsolute = function(g, f) {
        var c = g.split("/");
        if (/http:|https:|ftp:/.test(c[0])) {
            return g
        }
        var d, e = f.split("/");
        if (e.length > 3) {
            e.pop()
        }
        if (c[0] === "") {
            f = e[0] + "//" + e[2];
            e = f.split("/");
            delete c[0]
        }
        for (d = 0; d < c.length; d++) {
            if (c[d] === "..") {
                if (typeof c[d - 1] !== "undefined") {
                    delete c[d - 1]
                } else {
                    if (e.length > 3) {
                        e.pop()
                    }
                }
                delete c[d]
            }
            if (c[d] === ".") {
                delete c[d]
            }
        }
        var h = [];
        for (d = 0; d < c.length; d++) {
            if (typeof c[d] !== "undefined") {
                h[h.length] = c[d]
            }
        }
        return e.join("/") + "/" + h.join("/")
    };
    TumblrThemr.getHostname = function(c) {
        var d = new RegExp("^(?:f|ht)tp(?:s)?://([^/]+)", "im");
        return c.match(d)[1].toString()
    };
    $(function() {
        TumblrThemr.$config = $("#tumblrthemr-config");
        TumblrThemr.$loading = $("#tumblrthemr-loading");
        TumblrThemr.$error = $("#tumblrthemr-error");
        $("a:not(.tumblrthemr,.more_notes_link)").live("click", function(f) {
            var c = TumblrThemr.getHostname("http://" + TumblrThemr.config.url);
            if (this.hostname == c || this.hostname == "" || this.hostname == window.location.hostname) {
                f.preventDefault();
                var d = TumblrThemr.toAbsolute(this.pathname, "http://" + c);
                window.location.hash = "/url/" + d.replace(/http:\/\//g, "")
            }
        });
        $("a", TumblrThemr.$config).bind("click", function(d) {
            var c = ($("html").hasClass("tumblrthemr-start")) ? true : false;
            TumblrThemr.hideConfig(d, c)
        });
        $("#tumblrthemr-config-show").bind("click", TumblrThemr.showConfig);
        $("#tumblrthemr-config").bind("submit", TumblrThemr.saveConfig);
        TumblrThemr.app.run()
    })
})(jQuery);
