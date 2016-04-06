"use strict";
/// <reference path="typings/main/ambient/es6-shim/index.d.ts" />
/// <reference path="typings/main/ambient/node/index.d.ts" />
var SummaryTool = (function () {
    function SummaryTool() {
    }
    SummaryTool.prototype.splitIntoSentences = function (content) {
        var content = content.replace('\n', '. ');
        return content.match(/(.+?\.(?:\s|$))/g);
    };
    SummaryTool.prototype.splitContentIntoParagraphs = function (content) {
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
        var paragraphs = this.splitContentIntoParagraphs(content);
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
module.exports = SummaryTool;
