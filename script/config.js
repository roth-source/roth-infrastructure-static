var client = new roth.Client();

client.config.endpoint.dev = ["https://localhost:8443/"];
client.config.devConfigScript = "dev/config.js";

client.config.text =
{
	en : "en",
	es : "es"
};

client.config.layout =
{
	layout :
	{
		initializer : client.Initializer.params("layout", "initLayout"),
		renderer : "nunjucks"
	}
};

client.config.module =
{
	index :
	{
		layout : "index",
		page :
		{
			index :
			{
				
			}
		}
	},
	user :
	{
		layout : "blank",
		page :
		{
			login :
			{
				initializer : client.Initializer.params("user", "initLogin")
			}
		}
	},
	admin :
	{
		layout : "layout",
		initializers : "admin"
	},
	provider :
	{
		layout : "layout",
		initializers : "provider"
	},
	org :
	{
		layout : "layout",
		initializers : "org"
	},
	app :
	{
		layout : "layout",
		initializers : "app"
	}
};

var nunjucksConfigure = initNunjucks();
nunjucksConfigure.addFilter("currency", function(value)
{
	return currency(value);
});
nunjucksConfigure.addFilter("date", function(value, format)
{
	return date(value);
});
nunjucksConfigure.addFilter("space", function(value)
{
	return isValidString(value) ? value : "&nbsp;";
});
nunjucksConfigure.addGlobal("render", function(renderer, column, row)
{
	var values = [];
	if(isArray(renderer.fields))
	{
		for(var i in renderer.fields)
		{
			var field = renderer.fields[i];
			var value = client.getObjectValue(row, field);
			if(isSet(value))
			{
				values.push(value);
			}
		}
	}
	if(!isSet(renderer.name))
	{
		var value = "";
		var seperator = "";
		for(var i in values)
		{
			value += seperator + values[i];
			seperator = "<br/>";
		}
		return value;
	}
	else if("date" == renderer.name)
	{
		return date(values[0]);
	}
	else if("datetime" == renderer.name)
	{
		return date(values[0]);
	}
	else if("boolean" == renderer.name)
	{
		return values[0] == true;
	}
});

client.config.renderer.nunjucks = function(html, data)
{
	return nunjucks.renderString(html, data);
};

client.config.componentRenderer = "nunjucks";

client.config.validator.password = client.Validator.test(/^.{4,20}$/);

client.config.fieldDisplayor = function(element, status)
{
	var id = element.attr("id");
	if("valid" == status)
	{
		element.closest(".has-feedback").addClass("has-success").removeClass("has-error");
		element.siblings("i").addClass("glyphicon-ok").removeClass("glyphicon-remove");
	}
	else if("invalid" == status)
	{
		element.closest(".has-feedback").addClass("has-error").removeClass("has-success");
		element.siblings("i").addClass("glyphicon-remove").removeClass("glyphicon-ok");
	}
	else
	{
		element.closest(".has-feedback").removeClass("has-error").removeClass("has-success");
		element.siblings("i").removeClass("glyphicon-remove").removeClass("glyphicon-ok");
	}
};

client.config.disabler.spinner = function(element, disable)
{
	if(disable)
	{
		element.attr("data-loading-text", "<i class=\"fa fa-spinner fa-spin\"></i>");
		element.button("loading");
	}
	else
	{
		element.button("reset");
	}
};

client.init();

/*
$.fn.editable.defaults.mode = "inline";
$.fn.editable.defaults.showbuttons = false;
$.fn.editable.defaults.onblur = "submit";
$.fn.editable.defaults.ajaxOptions =
{
	type: "POST",
	dataType: "json"
};
$.fn.editable.defaults.params = function(params)
{
	return JSON.stringify(params);
};
*/