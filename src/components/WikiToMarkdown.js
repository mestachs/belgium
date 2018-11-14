const WikiToMarkdown = wiki => {
  wiki = wiki.replace("[pas clair]", "");
  wiki = wiki.replace("[r\u00e9f. n\u00e9cessaire]", "");
  wiki = wiki.replace("[\u00e9vasif]", "");
  wiki = wiki.replace(/=====\s*(.*)\s*=====/g, "#### $1\n\n");
  wiki = wiki.replace(/====\s*(.*)\s*====/g, "### $1\n\n");
  wiki = wiki.replace(/===\s*(.*)\s*===/g, "## $1");
  wiki = wiki.replace(/==\s*(.*)\s*==/g, "# $1");

  wiki = wiki.replace(/\[([^\s]*)\s([^\]]*)\]/g, "[$2]($1)");
  wiki = wiki.replace(/\*\*/g, "    *");
  return wiki;
};

export default WikiToMarkdown;
