export function rel_to_abs(url, location) {
  /* Only accept commonly trusted protocols:
   * Only data-image URLs are accepted, Exotic flavours (escaped slash,
   * html-entitied characters) are not supported to keep the function fast */
  if (/^(file|ftps?|mailto|javascript|data:image\/[^;]{2,9};)/i.test(url))
    return url; //Url is already absolute

  if (/^(https?)/i.test(url)) {
    url = location.href + url;
  }

  const base_url = location.href.match(/^(.+)\/?(?:#.+)?$/)[0] + "/";
  // if (url.substring(0, 2) == "//") return location.protocol + url;
  // else if (url.charAt(0) == "/")
  //   return location.protocol + "//" + location.host + url;
  // else if (url.substring(0, 2) == "./") url = "." + url;
  // else if (/^\s*$/.test(url)) return "";
  // //Empty = Return nothing
  // else url = "../" + url;

  // url = base_url + url;
  // const i = 0;
  // while (/\/\.\.\//.test((url = url.replace(/[^\/]+\/+\.\.\//g, ""))));

  /* Escape certain characters to prevent XSS */
  url = url
    .replace(/\.$/, "")
    .replace(/\/\./g, "")
    .replace(/"/g, "%22")
    .replace(/'/g, "%27")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E");

  return url;
}

export default function rewriteLink(html, location) {
  /*HTML/XML Attribute may not be prefixed by these characters (common 
     attribute chars.  This list is not complete, but will be sufficient
     for this function (see http://www.w3.org/TR/REC-xml/#NT-NameChar). */
  const att = "[^-a-z0-9:._]";

  const entityEnd = "(?:;|(?!\\d))";
  const ents = {
    " ": "(?:\\s|&nbsp;?|&#0*32" + entityEnd + "|&#x0*20" + entityEnd + ")",
    "(": "(?:\\(|&#0*40" + entityEnd + "|&#x0*28" + entityEnd + ")",
    ")": "(?:\\)|&#0*41" + entityEnd + "|&#x0*29" + entityEnd + ")",
    ".": "(?:\\.|&#0*46" + entityEnd + "|&#x0*2e" + entityEnd + ")",
  };
  /* Placeholders to filter obfuscations */
  const charMap = {};
  const s = ents[" "] + "*"; //Short-hand for common use
  const any = "(?:[^>\"']*(?:\"[^\"]*\"|'[^']*'))*?[^>]*";
  /* ^ Important: Must be pre- and postfixed by < and >.
   *   This RE should match anything within a tag!  */

  /*
    @name ae
    @description  Converts a given string in a sequence of the original
                    input and the HTML entity
    @param String string  String to convert
    */
  function ae(string) {
    const all_chars_lowercase = string.toLowerCase();
    if (ents[string]) return ents[string];
    const all_chars_uppercase = string.toUpperCase();
    let RE_res = "";
    for (let i = 0; i < string.length; i++) {
      const char_lowercase = all_chars_lowercase.charAt(i);
      if (charMap[char_lowercase]) {
        RE_res += charMap[char_lowercase];
        continue;
      }
      const char_uppercase = all_chars_uppercase.charAt(i);
      const RE_sub = [char_lowercase];
      RE_sub.push("&#0*" + char_lowercase.charCodeAt(0) + entityEnd);
      RE_sub.push(
        "&#x0*" + char_lowercase.charCodeAt(0).toString(16) + entityEnd
      );
      if (char_lowercase != char_uppercase) {
        /* Note: RE ignorecase flag has already been activated */
        RE_sub.push("&#0*" + char_uppercase.charCodeAt(0) + entityEnd);
        RE_sub.push(
          "&#x0*" + char_uppercase.charCodeAt(0).toString(16) + entityEnd
        );
      }
      RE_res += charMap[char_lowercase] = "(?:" + RE_sub.join("|") + ")";
    }
    return (ents[string] = RE_res);
  }

  /*
    @name by
    @description  2nd argument for replace().
    */
  function by(match, group1, group2, group3) {
    /* Note that this function can also be used to remove links:
     * return group1 + "javascript://" + group3; */
    return group1 + rel_to_abs(group2, location) + group3;
  }
  /*
    @name by2
    @description  2nd argument for replace(). Parses relevant HTML entities
    */
  const slashRE = new RegExp(ae("/"), "g");
  const dotRE = new RegExp(ae("."), "g");
  function by2(match, group1, group2, group3) {
    /*Note that this function can also be used to remove links:
     * return group1 + "javascript://" + group3; */
    group2 = group2.replace(slashRE, "/").replace(dotRE, ".");
    return group1 + rel_to_abs(group2, location) + group3;
  }
  /*
    @name cr
    @description            Selects a HTML element and performs a
                              search-and-replace on attributes
    @param String selector  HTML substring to match
    @param String attribute RegExp-escaped; HTML element attribute to match
    @param String marker    Optional RegExp-escaped; marks the prefix
    @param String delimiter Optional RegExp escaped; non-quote delimiters
    @param String end       Optional RegExp-escaped; forces the match to end
                            before an occurence of <end>
   */
  function cr(selector, attribute, marker?, delimiter?, end?) {
    if (typeof selector == "string") selector = new RegExp(selector, "gi");
    attribute = att + attribute;
    marker = typeof marker == "string" ? marker : "\\s*=\\s*";
    delimiter = typeof delimiter == "string" ? delimiter : "";
    end = typeof end == "string" ? "?)(" + end : ")(";
    const re1 = new RegExp(
      "(" + attribute + marker + '")([^"' + delimiter + "]+" + end + ")",
      "gi"
    );
    const re2 = new RegExp(
      "(" + attribute + marker + "')([^'" + delimiter + "]+" + end + ")",
      "gi"
    );
    const re3 = new RegExp(
      "(" +
        attribute +
        marker +
        ")([^\"'][^\\s>" +
        delimiter +
        "]*" +
        end +
        ")",
      "gi"
    );

    html = html.replace(selector, function (match) {
      return match.replace(re1, by).replace(re2, by).replace(re3, by);
    });
  }
  /* 
    @name cri
    @description            Selects an attribute of a HTML element, and
                              performs a search-and-replace on certain values
    @param String selector  HTML element to match
    @param String attribute RegExp-escaped; HTML element attribute to match
    @param String front     RegExp-escaped; attribute value, prefix to match
    @param String flags     Optional RegExp flags, default "gi"
    @param String delimiter Optional RegExp-escaped; non-quote delimiters
    @param String end       Optional RegExp-escaped; forces the match to end
                              before an occurence of <end>
   */
  function cri(selector, attribute, front, flags, delimiter?, end?) {
    if (typeof selector == "string") selector = new RegExp(selector, "gi");
    attribute = att + attribute;
    flags = typeof flags == "string" ? flags : "gi";
    const re1 = new RegExp("(" + attribute + '\\s*=\\s*")([^"]*)', "gi");
    const re2 = new RegExp("(" + attribute + "\\s*=\\s*')([^']+)", "gi");
    const at1 = new RegExp("(" + front + ')([^"]+)(")', flags);
    const at2 = new RegExp("(" + front + ")([^']+)(')", flags);
    let handleAttr = (match, g1, g2) => void 0;
    if (typeof delimiter == "string") {
      end = typeof end == "string" ? end : "";
      const at3 = new RegExp(
        "(" +
          front +
          ")([^\"'][^" +
          delimiter +
          "]*" +
          (end ? "?)(" + end + ")" : ")()"),
        flags
      );
      handleAttr = (match, g1, g2) => {
        return g1 + g2.replace(at1, by2).replace(at2, by2).replace(at3, by2);
      };
    } else {
      handleAttr = (match, g1, g2) => {
        return g1 + g2.replace(at1, by2).replace(at2, by2);
      };
    }
    html = html.replace(selector, function (match) {
      return match.replace(re1, handleAttr).replace(re2, handleAttr);
    });
  }

  /* <meta http-equiv=refresh content="  ; url= " > */
  cri(
    "<meta" +
      any +
      att +
      'http-equiv\\s*=\\s*(?:"' +
      ae("refresh") +
      '"' +
      any +
      ">|'" +
      ae("refresh") +
      "'" +
      any +
      ">|" +
      ae("refresh") +
      "(?:" +
      ae(" ") +
      any +
      ">|>))",
    "content",
    ae("url") + s + ae("=") + s,
    "i"
  );

  cr("<" + any + att + "href\\s*=" + any + ">", "href"); /* Linked elements */
  cr("<" + any + att + "src\\s*=" + any + ">", "src"); /* Embedded elements */

  cr(
    "<object" + any + att + "data\\s*=" + any + ">",
    "data"
  ); /* <object data= > */
  cr(
    "<applet" + any + att + "codebase\\s*=" + any + ">",
    "codebase"
  ); /* <applet codebase= > */

  /* <param name=movie value= >*/
  cr(
    "<param" +
      any +
      att +
      'name\\s*=\\s*(?:"' +
      ae("movie") +
      '"' +
      any +
      ">|'" +
      ae("movie") +
      "'" +
      any +
      ">|" +
      ae("movie") +
      "(?:" +
      ae(" ") +
      any +
      ">|>))",
    "value"
  );

  cr(
    /<style[^>]*>(?:[^"']*(?:"[^"]*"|'[^']*'))*?[^'"]*(?:<\/style|$)/gi,
    "url",
    "\\s*\\(\\s*",
    "",
    "\\s*\\)"
  ); /* <style> */
  cri(
    "<" + any + att + "style\\s*=" + any + ">",
    "style",
    ae("url") + s + ae("(") + s,
    0,
    s + ae(")"),
    ae(")")
  ); /*< style=" url(...) " > */
  return html;
}
