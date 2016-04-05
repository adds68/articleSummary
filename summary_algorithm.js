/// <reference path="typings/main/ambient/es6-shim/index.d.ts" />
/// <reference path="typings/main/ambient/node/index.d.ts" />
var SummaryTool = (function () {
    function SummaryTool() {
    }
    SummaryTool.prototype.splitIntoSentences = function (content) {
        var content = content.replace('\n', '. ');
        return content.match(/(.+?\.(?:\s|$))/g);
    };
    SummaryTool.prototype.splitContentToParagraphs = function (content) {
        return content.split('\n\n');
    };
    SummaryTool.prototype.sentencesIntersection = function (sent1, sent2) {
        var splitText1 = sent1.split(' ');
        var splitText2 = sent2.split(' ');
        var intersections = [];
        var j = 0;
        //find intersections
        for (var i = 0; i < splitText1.length; ++i)
            if (splitText2.indexOf(splitText1[i]) != -1)
                intersections[j++] = splitText1[i];
        var spliceHere = ((splitText1.length + splitText2.length) / 2);
        return (intersections.splice(0, spliceHere).length); //normalising the results breaks the algorithm? 
    };
    SummaryTool.prototype.formatSentence = function (sentence) {
        return sentence.replace(/\W+/g, '');
    };
    SummaryTool.prototype.getSentenceRanks = function (content) {
        var sentences = this.splitIntoSentences(content);
        //calculate the intersection for every two sentences
        var n = sentences.length;
        var values = [];
        //python list comprehension alternative
        for (var i = 0; i < n; i++) {
            var tempArray = [];
            for (var x = 0; x < n; x++) {
                tempArray.push(0);
            }
            values.push(tempArray);
        }
        for (var i = 0; i < n; i++) {
            for (var x = 0; x < n; x++) {
                values[i][x] = this.sentencesIntersection(sentences[i], sentences[x]);
            }
        }
        //build dict of sentences 
        var sentencesDict = {};
        for (var i = 0; i < n; i++) {
            var score = 0;
            for (var x = 0; x < n; x++) {
                if (i !== x) {
                    score += values[i][x];
                }
            }
            sentencesDict[this.formatSentence(sentences[i])] = score;
        }
        return sentencesDict;
    };
    //return the best sentence in a paragraph
    SummaryTool.prototype.getBestSentence = function (paragraph, sentencesDict) {
        var sentences = this.splitIntoSentences(paragraph);
        if (sentences.length < 2) {
            return "";
        }
        else {
            var bestSentence = "";
            var maxValue = 0;
            for (var i = 0; i < sentences.length; i++) {
                var strippedSentence = this.formatSentence(sentences[i]);
                if (strippedSentence) {
                    if (sentencesDict[strippedSentence] > maxValue) {
                        maxValue = sentencesDict[strippedSentence];
                        bestSentence = sentences[i];
                    }
                }
            }
            return bestSentence;
        }
    };
    //build up the summary
    SummaryTool.prototype.buildSummary = function (title, content, sentencesDict) {
        var paragraphs = this.splitContentToParagraphs(content);
        var summary = [];
        summary.push(title);
        summary.push("");
        for (var i = 0; i < paragraphs.length; i++) {
            var sentence = this.getBestSentence(paragraphs[i], sentencesDict);
            if (sentence) {
                summary.push(sentence);
            }
        }
        return summary.join('\n');
    };
    return SummaryTool;
}());
var title = " \
Swayy is a beautiful new dashboard for discovering and curating online content [Invites] \
";
var content = " \
Lior Degani, the Co-Founder and head of Marketing of Swayy, pinged me last week when I was in California to tell me about his startup and give me beta access. I heard his pitch and was skeptical. I was also tired, cranky and missing my kids – so my frame of mind wasn’t the most positive. \
I went into Swayy to check it out, and when it asked for access to my Twitter and permission to tweet from my account, all I could think was, “If this thing spams my Twitter account I am going to bitch-slap him all over the Internet.” Fortunately that thought stayed in my head, and not out of my mouth. \
\
One week later, I’m totally addicted to Swayy and glad I said nothing about the spam (it doesn’t send out spam tweets but I liked the line too much to not use it for this article). I pinged Lior on Facebook with a request for a beta access code for TNW readers. I also asked how soon can I write about it. It’s that good. Seriously. I use every content curation service online. It really is That Good. \
\
What is Swayy? It’s like Percolate and LinkedIn recommended articles, mixed with trending keywords for the topics you find interesting, combined with an analytics dashboard that shows the trends of what you do and how people react to it. I like it for the simplicity and accuracy of the content curation. Everything I’m actually interested in reading is in one place – I don’t have to skip from another major tech blog over to Harvard Business Review then hop over to another major tech or business blog. It’s all in there. And it has saved me So Much Time \
\
\
\
After I decided that I trusted the service, I added my Facebook and LinkedIn accounts. The content just got That Much Better. I can share from the service itself, but I generally prefer reading the actual post first – so I end up sharing it from the main link, using Swayy more as a service for discovery.\
\
I’m also finding myself checking out trending keywords more often (more often than never, which is how often I do it on Twitter.com).\
\
\
\
The analytics side isn’t as interesting for me right now, but that could be due to the fact that I’ve barely been online since I came back from the US last weekend. The graphs also haven’t given me any particularly special insights as I can’t see which post got the actual feedback on the graph side (however there are numbers on the Timeline side.) This is a Beta though, and new features are being added and improved daily. I’m sure this is on the list. As they say, if you aren’t launching with something you’re embarrassed by, you’ve waited too long to launch. \
\
It was the suggested content that impressed me the most. The articles really are spot on – which is why I pinged Lior again to ask a few questions:\
\
How do you choose the articles listed on the site? Is there an algorithm involved? And is there any IP?\
\
Yes, we’re in the process of filing a patent for it. But basically the system works with a Natural Language Processing Engine. Actually, there are several parts for the content matching, but besides analyzing what topics the articles are talking about, we have machine learning algorithms that match you to the relevant suggested stuff. For example, if you shared an article about Zuck that got a good reaction from your followers, we might offer you another one about Kevin Systrom (just a simple example).\
\
Who came up with the idea for Swayy, and why? And what’s your business model?\
\
Our business model is a subscription model for extra social accounts (extra Facebook / Twitter, etc) and team collaboration.\
\
The idea was born from our day-to-day need to be active on social media, look for the best content to share with our followers, grow them, and measure what content works best.\
\
Who is on the team?\
\
Ohad Frankfurt is the CEO, Shlomi Babluki is the CTO and Oz Katz does Product and Engineering, and I [Lior Degani] do Marketing. The four of us are the founders. Oz and I were in 8200 [an elite Israeli army unit] together. Emily Engelson does Community Management and Graphic Design.\
\
If you use Percolate or read LinkedIn’s recommended posts I think you’ll love Swayy.\
\
➤ Want to try Swayy out without having to wait? Go to this secret URL and enter the promotion code thenextweb . The first 300 people to use the code will get access.\
\
Image credit: Thinkstock\
\
";
console.log(process.argv);
var summaryTool = new SummaryTool();
var sentencesDict = summaryTool.getSentenceRanks(content);
var summary = summaryTool.buildSummary(title, content, sentencesDict);
console.log(summary);
