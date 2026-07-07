import assert from "node:assert/strict";
import { md2html } from "../hosts/shared/md2html.mjs";

assert.match(md2html("**bold** and `code`"), /<strong>bold<\/strong>/);
assert.match(md2html("**bold** and `code`"), /<code>code<\/code>/);
assert.match(
  md2html("[OWASP](https://owasp.org/example)"),
  /<a href="https:\/\/owasp.org\/example"/,
);
assert.match(
  md2html("```bash\navahi-browse -a\n```"),
  /<pre><code>avahi-browse -a<\/code><\/pre>/,
);
assert.doesNotMatch(md2html("<script>x</script>"), /<script/u);

console.log("md2html.test.mjs OK");
