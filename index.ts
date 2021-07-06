import fs from 'fs-extra';
import TurndownService from 'turndown';

async function main() {
  const turndownService = new TurndownService({ bulletListMarker: '-' });

  const json = fs.readJsonSync('./from.json') as {
    [key: string]: any;
  };

  /*
  const data = "折りたたみ（Collapse &amp; expand）\n<ul>\n\t<li>島として並べるときに空間の節約のため重要</li>\n\t<li>KJ法ができる程度に大きめのこざねにする。Macの折りたたまれた付箋では小さ過ぎる\n\t<ul>\n\t\t<li>全体をドラッグ可能なこざね。ダブルクリックで元のカードに戻る。</li>\n\t\t<li>小札には、カードの一行目と左上の「新規作成」ボタンのみ表示。\n\t\t<ul>\n\t\t\t<li>閉じるボタンは置かない。</li>\n\t\t</ul>\n\t\t</li>\n\t</ul>\n\t</li>\n\t<li>カードの一行目だけを表示して以下をマスクする、\n\t<ul>\n\t\t<li>というのをオンオフできれば、ワードカードのように記憶訓練にも使える。</li>\n\t</ul>\n\t</li>\n\t<li>これでデスクトップの面積がまた節約できる。</li>\n\t<li>縦にたたむこともできる\n\t<ul>\n\t\t<li>とくに異なるサイズのデスクトップ上での Focus+Contextのために利用</li>\n\t\t<li>英語は90度回転表示となる。</li>\n\t</ul>\n\t</li>\n</ul>\n";
  const html  = data.replace(/[\n\t]/g, '');
  const markdown = turndownService.turndown(html);
  console.log(markdown);
  */

  await fs.remove('./output');
  await fs.ensureDir('./output');

  const cards = json['card']['cards'] as { [key: string]: string }[];
  const cardContents: { [key: string]: string } = {};
  for (const card of cards) {
    const html = card['data'].replace(/[\n\t]/g, '');
    let markdown = turndownService.turndown(html);
    markdown = markdown.replace(/\n\n/, '\n');
    markdown = markdown.replace(/^([\-\s].+)$/gm, '    $1');
    markdown = markdown.replace(/^([^\s].+)$/gm, '-   $1');
    cardContents[card['id']] = markdown + '\n';
  }

  const spaces = json['workspace']['spaces'] as any[];

  for (const space of spaces) {
    const spaceName = space['name'];
    for (const avatar of space['avatars'] as {
      [key: string]: string;
    }[]) {
      const urlArray = avatar['url'].split('/');
      const cardID = urlArray[urlArray.length - 2];
      const contents = cardContents[cardID];
      fs.appendFileSync(`./output/${spaceName}.md`, contents, { encoding: 'utf-8' });
    }
  }
}

main();