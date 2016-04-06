/// <reference path="typings/main/ambient/es6-shim/index.d.ts" />
/// <reference path="typings/main/ambient/node/index.d.ts" />
class SummaryTool {
    
    splitIntoSentences(content: string): string[] {
        var content: string = content.replace('\n', '. ');
        return content.match(/(.+?\.(?:\s|$))/g);
    }
    
    splitContentIntoParagraphs(content: string): string[] {
        return content.split('\n\n');
    }
    
    sentencesIntersection(sent1: string, sent2: string): number {
        
        var splitText1: Array<string> = sent1.split(' ');
        var splitText2: Array<string> = sent2.split(' ');
        
        var intersections: string[] = [];
        var j: number = 0;
        
        //find intersections
        for (var i: number = 0; i < splitText1.length; ++i)
            if (splitText2.indexOf(splitText1[i]) != -1)
                intersections[j++] = splitText1[i];
                
        var spliceHere = ((splitText1.length + splitText2.length) / 2);
        
        return (intersections.splice(0, spliceHere).length);   //normalising the results breaks the algorithm? 
    }
    
    formatSentence(sentence: string): string {
        return sentence.replace(/\W+/g, '');
    }
    
    getSentenceRanks(content: string): {[id: string]: number} {
        
        var sentences = this.splitIntoSentences(content);
        
        //calculate the intersection for every two sentences
        var n: number = sentences.length;
        var values: Array<number[]> = [];
        
        //python list comprehension alternative
        for (var i: number = 0; i < n; i++) {
            
            var tempArray: number[] = [];
            
            for(var x: number = 0; x < n; x++) {
                tempArray.push(0);    
            }
            values.push(tempArray);
        }
        
        for(var i: number = 0; i < n; i++) {
            for(var x: number = 0; x < n; x++) {
                values[i][x] = this.sentencesIntersection(sentences[i], sentences[x]);
            }
        }
        
        //build dict of sentences 
        var sentencesDict: {[id: string]: number} = {};
        for (var i: number = 0; i < n; i++) {
            var score = 0;
            for (var x: number = 0; x < n; x++) {
                if (i !== x) {
                    score += values[i][x];
                } 
            }
            sentencesDict[this.formatSentence(sentences[i])] = score;
        }
        return sentencesDict;
    }
    
    //return the best sentence in a paragraph
    getBestSentence(paragraph: string, sentencesDict: {[id: string]: number}): string {
        
        var sentences: string[] = this.splitIntoSentences(paragraph);
        
        if (sentences.length < 2) {
            return "";
        } else {
            var bestSentence: string = "";
            var maxValue: number = 0;
            
            for (var i: number = 0; i < sentences.length; i++) {
                var strippedSentence: string = this.formatSentence(sentences[i]);
                if (strippedSentence) {
                    if (sentencesDict[strippedSentence] > maxValue) {
                        maxValue = sentencesDict[strippedSentence];
                        bestSentence = sentences[i];
                    }
                }
            }
            
            return bestSentence;
        }
    }
    
    //build up the summary
    buildSummary(title: string, content: string, sentencesDict: {[id: string]: number}): string {
        
        var paragraphs: string[] = this.splitContentIntoParagraphs(content);
        
        var summary: string[] = [];
        summary.push(title);
        summary.push("");
        
        for (var i: number = 0; i < paragraphs.length; i++) {
            var sentence: string = this.getBestSentence(paragraphs[i], sentencesDict);
            if (sentence) {
                summary.push(sentence);
            } 
        }
        return summary.join('\n');
    }
}
export = SummaryTool;