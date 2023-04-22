export function parseMd(md){
  //strong
  md = md.replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, '<strong>$1</strong>');
  // italic
  md = md.replace(/[\*\_]{1}([^\*\_\n]+)[\*\_]{1}/g, '<i>$1</i>');

  //ul
  md = md.replace(/((^\*.+\n*)+$)/gm, '<ul>\n$1\n</ul>');
  md = md.replace(/^\*(.+)/gm, '<li>$1</li>');
  
  //ol
  md = md.replace(/((^\d\..+\n*)+$)/gm, '<ol>\n$1\n</ol>');
  md = md.replace(/^\d\.(.+)/gm, '<li>$1</li>');
  
  // blockquote
  md = md.replace(/^\>(.+)/gm, '<blockquote>$1</blockquote>');
  
  //h (왜 m을 빼면 안 될까?)
  md = md.replace(/^[\#]{3}([^\#\n]+)/gm, '<h3>$1</h3>');
  md = md.replace(/^[\#]{2}([^\#\n]+)/gm, '<h2>$1</h2>');
  md = md.replace(/^[\#]{1}([^\#\n]+)/gm, '<h1>$1</h1>');
  
  //alt h
  // md = md.replace(/^(.+)\n\=+/gm, '<h1>$1</h1>');
  // md = md.replace(/^(.+)\n\-+/gm, '<h2>$1</h2>');

  //hr
  md = md.replace(/^-{3,}$/gm, '<hr>');

  //images
  // md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');
  
  //links
  md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');

  // ?
  md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '<del>$1</del>');
  
  //pre
  md = md.replace(/^\s*\`{3}(\S*)\n([\s\S]*)\`{3}$/gm, '<pre class="$1"><code>$2</code></pre>');
  
  //code
  md = md.replace(/[\`]{1}([^\`]+)[\`]{1}/g, '<code>$1</code>');
  
  //p
  md = md.replace(/^\s*([^\n]+)/gm, function(m){
    return  /\<(\/)?(hr|h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>'+m+'</p>';
  });
  
  //strip p from pre
  md = md.replace(/(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm, '$1$2');
  
  return md;
}