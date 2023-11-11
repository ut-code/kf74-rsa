# kf74-rsa
```sh
npm install
npm run dev
```

https://kf74-rsa.pages.dev/

## 公開鍵暗号とは
公開鍵暗号とは、暗号化と復号に異なる鍵を用いる暗号方式です。暗号化に用いる鍵を公開鍵、復号に用いる鍵を秘密鍵と呼びます。公開鍵暗号は、秘密鍵を知らない第三者が公開鍵を用いて暗号化したデータを、秘密鍵を知っている第三者だけが復号できるようにするために用いられます。

## RSA暗号のしくみ
ここではRSA暗号のしくみを説明します。きちんと理解するためには高校数学程度の知識が必要になります。興味がなければ、ここは読み飛ばして次の「文字コード」に進んでも大丈夫です。  
RSA暗号では公開鍵と秘密鍵が複数の自然数で表されます。それらがどんな数であるかを順を追って説明します。まず、相異なる大きな素数 $p$ と $q$ を考えます。これらの積を $n = pq$ とします。また、 $\phi(n) = (p-1)(q-1)$  ( $\phi (n)$ はオイラー関数と呼ばれます)と互いに素な自然数 $c$ を1つとります。このとき、 $c$ と $\phi(n)$ は互いに素なので、 $cd - k\phi(n) = 1$ となる自然数 $k$ と $d$ が存在します。   
さて、RSA暗号では、 $c$ と $n$ を公開鍵、 $p$ と $q$ と $d$ を秘密鍵とします。このとき、平文 $x$ に対して、暗号文 $y$ は  
$y \equiv x^c \mod n$  
で計算されます。また、暗号文 $y$ に対して、平文 $m$ は  
$x \equiv y^d \mod n$  
で計算されます。  
これはなぜでしょうか。  
$y^d = x^{cd} = x^{k\phi(n) + 1} = x^{k(p-1)(q-1) + 1} = (x^{k(q-1)})^{p-1} \cdot x$  
となりますが、 $p$ が十分大きな素数であるとき、 $x^{k(q-1)}$ と $p$ は互いに素なので、フェルマーの小定理より、    
$(x^{k(q-1)})^{p-1} = 1 \mod p$  
です。したがって  
$y^d \equiv 1 \cdot x \equiv x \mod p$  
となります。よって $y^d - x$ は $p$ の倍数です。同様にして $y^d - x$ は $q$ の倍数でもあります。したがって、 $y^d - x$ は $n = pq$ の倍数です。よって、 $y^d \equiv x \mod n$ であることがわかります。

## 文字コード
文字コードとは、文字をコンピュータで扱うために、文字に対応する数値を定めたものです。文字コードには様々なものがありますが、ここでは、ASCIIコードとUnicodeを紹介します。  
ASCIIコードは、アルファベット、数字、記号などの文字をコンピュータで扱うために、それぞれの文字に対応する7ビットの数値(0～127の128通り)を定めたものです。例を見てみましょう。例えば大文字の 'A' は、ASCIIコードでは 65 と定められています。また、小文字の 'a' は、ASCIIコードでは 97 と定められています。ASCIIコードでは、アルファベットの大文字と小文字は、それぞれ、65から90まで('A'～'Z')の数値と、97から122('a'～'z')までの数値に対応しています。また、'0'～'9'の数字は、それぞれ 48~57までの数値に対応しています。また、記号の中で、'!'は33、'?'は63、'+'は43、'-'は45、'/'は47、'='は61などに対応しています。その他にも、改行を表す文字や、スペース、タブなどの、制御文字と呼ばれる特殊な文字にも、対応する数値が定められています。  
さて、ASCIIコードが扱えるのは、アルファベット、数字、およびいくつかの記号などに限られます。先ほども述べたようにASCIIコードで使える数値は128通りしかありません。しかし、今あなたがコンピュータの画面上で読んでいる文章は、ひらがなやカタカナ、そして漢字が使われています。漢字だけでも128通りは優に超えますし、また世界には他にも多くの文字があります。これらの文字のように、世界中で使われている様々な文字をもコンピュータ上で扱うために、ASCIIコード以外にも色んな文字コードが考案されています。  その代表的な規格としてUnicodeがあります。Unicodeの文字に対応する数値を定める方式として、UTF-8、UTF-16、UTF-32などがありますが、ここではUTF-8について説明します。  
UTF-8では、8ビットの値(0～255)を1つの符号単位として、1～4の符号単位を用いて1つの文字を表します。例えばASCIIコードにもあった'A'は、1つの符号単位を用いて 65 と表されます(ASCIIコードと同様)。また、ひらがなの'あ'は、3つの符号単位を用いて 227, 129, 130 と表されます。さらに絵文字を表すこともでき、例えば'😊'は、4つの符号単位を用いて 240, 159, 152, 138 と表されます。 

## RSA暗号の使い方
RSA暗号の使い方を説明します。先ほども述べたように、RSA暗号では公開鍵 $c$ と $n$ 、および秘密鍵 $p$ と $q$ と $d$ を用います。ここでは、$c=13$ 、 $n=2987$ 、 $p=29$ 、 $q=103$ 、 $d=2197$ とします(「RSA暗号のしくみ」を読んだ人は、これらが $n=pq$ などの条件を満たしていることを確認してみるとよいでしょう)。では、これらの鍵を用いて "こんにちは" という文字列を暗号化し、できた暗号を復号してみましょう。  
まず、UTF-8を用いて "こんにちは" を数字の列に変換します。このことをエンコードといいます。'こ'は、 227, 129, 147 に変換されます。'ん'は、 227, 130, 147 に変換されます。以下同様に変換していくと、"こんにちは"は全体として 227, 129, 147, 227, 130, 147, 227, 129, 171, 227, 129, 161, 227, 129, 175 に変換されます。  
続いて暗号化を行います。暗号化では、エンコードによって得られた数をそれぞれ $c$ 乗して、 $n$ で割った余りを求めます。例えば、最初の 227 は、227 の 13 乗を 2987 で割った余りを計算することになります。これは手計算で行うのは大変ですが、コンピュータや電卓を使って計算すると 1821 になることがわかります。同様にして、2つ目以降の数についても 13 乗して 2987 で割った余りを計算すると、全体として 1821, 328, 2740, 1821, 2612, 2740, 1821, 328, 2910, 1821, 328, 2833, 1821, 328, 1451 となります。つまり、これが "こんにちは" を暗号化したものになります。  
次に、この暗号を復号します。復号では、数を $d$ 乗して $n$ で割った余りを求めます。例えば、最初の 1821 は、1821 の 2197 乗を 2987 で割った余りを計算することになります。これもコンピュータや電卓を使って計算すると、 227 になることがわかります。同様にして、2つ目以降の数についても 2197 乗して 2987 で割った余りを計算すると、全体として 227, 129, 147, 227, 130, 147, 227, 129, 171, 227, 129, 161, 227, 129, 175 となります。つまり、これが "こんにちは" を復号したものになります。  
最後に、これらの数を文字に変換します。つまりエンコードの逆の操作を行います(これをデコードといいます)。復号した結果の最初の3つの数は 227, 129, 147 ですが、これは 'こ' に対応する数です。同様にして、2つ目以降の数についてもデコードすると、全体として"こんにちは"となります。よって、RSA暗号を用いて文字列を暗号化し、復号することができました。
