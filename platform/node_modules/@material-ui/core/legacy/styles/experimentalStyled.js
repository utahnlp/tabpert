import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _extends from "@babel/runtime/helpers/esm/extends";
import styled from '@material-ui/styled-engine';
import { propsToClassKey } from '@material-ui/styles';
import { styleFunctionSx } from '../Box/styleFunction';
import defaultTheme from './defaultTheme';

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

var getStyleOverrides = function getStyleOverrides(name, theme) {
  var styleOverrides = {};

  if (theme && theme.components && theme.components[name] && theme.components[name].styleOverrides) {
    styleOverrides = theme.components[name].styleOverrides;
  }

  return styleOverrides;
};

var getVariantStyles = function getVariantStyles(name, theme) {
  var variants = [];

  if (theme && theme.components && theme.components[name] && theme.components[name].variants) {
    variants = theme.components[name].variants;
  }

  var variantsStyles = {};
  variants.forEach(function (definition) {
    var key = propsToClassKey(definition.props);
    variantsStyles[key] = definition.style;
  });
  return variantsStyles;
};

var variantsResolver = function variantsResolver(props, styles, theme, name) {
  var _theme$components, _theme$components$nam;

  var _props$styleProps = props.styleProps,
      styleProps = _props$styleProps === void 0 ? {} : _props$styleProps;
  var variantsStyles = {};
  var themeVariants = theme === null || theme === void 0 ? void 0 : (_theme$components = theme.components) === null || _theme$components === void 0 ? void 0 : (_theme$components$nam = _theme$components[name]) === null || _theme$components$nam === void 0 ? void 0 : _theme$components$nam.variants;

  if (themeVariants) {
    themeVariants.forEach(function (themeVariant) {
      var isMatch = true;
      Object.keys(themeVariant.props).forEach(function (key) {
        if (styleProps[key] !== themeVariant.props[key] && props[key] !== themeVariant.props[key]) {
          isMatch = false;
        }
      });

      if (isMatch) {
        variantsStyles = _extends({}, variantsStyles, styles[propsToClassKey(themeVariant.props)]);
      }
    });
  }

  return variantsStyles;
};

var shouldForwardProp = function shouldForwardProp(prop) {
  return prop !== 'styleProps' && prop !== 'theme' && prop !== 'sx';
};

var experimentalStyled = function experimentalStyled(tag, options) {
  var muiOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var name = muiOptions.muiName;
  var defaultStyledResolver = styled(tag, _extends({
    shouldForwardProp: shouldForwardProp,
    label: name
  }, options));

  var muiStyledResolver = function muiStyledResolver() {
    for (var _len = arguments.length, styles = new Array(_len), _key = 0; _key < _len; _key++) {
      styles[_key] = arguments[_key];
    }

    var stylesWithDefaultTheme = styles.map(function (stylesArg) {
      return typeof stylesArg === 'function' ? function (_ref) {
        var themeInput = _ref.theme,
            rest = _objectWithoutProperties(_ref, ["theme"]);

        return stylesArg(_extends({
          theme: isEmpty(themeInput) ? defaultTheme : themeInput
        }, rest));
      } : stylesArg;
    });

    if (name && muiOptions.overridesResolver) {
      stylesWithDefaultTheme.push(function (props) {
        var theme = isEmpty(props.theme) ? defaultTheme : props.theme;
        return muiOptions.overridesResolver(props, getStyleOverrides(name, theme), name);
      });
    }

    if (name) {
      stylesWithDefaultTheme.push(function (props) {
        var theme = isEmpty(props.theme) ? defaultTheme : props.theme;
        return variantsResolver(props, getVariantStyles(name, theme), theme, name);
      });
    }

    stylesWithDefaultTheme.push(function (props) {
      var theme = isEmpty(props.theme) ? defaultTheme : props.theme;
      return styleFunctionSx(props.sx, theme);
    });
    return defaultStyledResolver(stylesWithDefaultTheme);
  };

  return muiStyledResolver;
};

export default experimentalStyled;