//SCRIPTS for template engine and rendering JSON data

//Simple Template Engine Class
class SimpleTemplateEngine {
    //template passed to constructer
    constructor(template_url) {
        //'this' makes template_url a usable variable that can store data
        this.template_url = template_url;
    }

    //LOAD TEMPLATE
    //fetch returns promise
    //.then will wait for response
    loadTemplate() {
        return fetch(this.template_url)
            //with response perform function .text (also returns promise)
            .then(response => response.text())
            //set this.template to response text
            .then(text => {
                this.template = text;
            });
    }

    //RENDERING FN
    renderTemplate(data) {
        let output = this.template;

        //setup 'for each' by swapping out each tag via RE
        output = output.replace(/{{#each (\w+)}}([\s\S]*?){{\/each}}/g, (match, arrayName, templateFragment) => {
            const listOfThings = data[arrayName];
            if (!Array.isArray(listOfThings)) {
                return '';
            }
            return listOfThings.map(item => {
                //for arrays of strings set 'this' as placeholder
                if (typeof item === 'string') {
                    return templateFragment.replace(/{{this}}/g, item);
                }
                return this.replaceVariablesInFragment(templateFragment, item);
            }).join(', ');
        });

        //RE pattern search (fancy method)
        //deals with any simple variables in data fragment
        output = output.replace(/{{(\w+)}}/g, (match, variable) => {
            return data[variable] || '';
        });

        return output;
    }

    //replaces variable names in data fragment
    replaceVariablesInFragment(templateFragment, data) {
        return templateFragment.replace(/{{(\w+)}}/g, (match, dataKey) => {
            return data[dataKey] || '';
        });
    }
}

//CREATE OBJECT -> SimpleTemplateEngine
const tEngine = new SimpleTemplateEngine('template.html');

document.addEventListener('DOMContentLoaded', () => {
    //load template
    tEngine.loadTemplate().then(() => {
        if (document.getElementById('timeline')) {
            fetchTimeline();
        }
        if (document.getElementById('homeText')) {
            fetchHomeText();
        }
        if (document.getElementById('aboutText')) {
            fetchAboutText();
        }
        if (document.getElementById('1990')) {
            fetchHistoryTimeline();
            fetchReferencesText();
            document.getElementById('entriesByYearForm').addEventListener('submit', getEntriesByYear);
        }
    });
});

//fetch about page text
function fetchAboutText() {
    fetch('http://localhost:3000/abouttext')
        .then(response => response.json())
        .then(data => {
            document.getElementById('aboutText').textContent = data.aboutText;
        })
        .catch(error => console.error('Error fetching about text:', error));
}

//fetch references text
function fetchReferencesText() {
    fetch('http://localhost:3000/referencestext')
        .then(response => response.json())
        .then(data => {
            document.getElementById('referencesText').textContent = data.referencesText;
        })
        .catch(error => console.error('Error fetching references text:', error));
}

//fetch home page text
function fetchHomeText() {
    fetch('http://localhost:3000/hometext')
        .then(response => response.json())
        .then(data => {
            document.getElementById('homeText').textContent = data.homeText;
        })
        .catch(error => console.error('Error fetching home text:', error));
}

//fetch data from the REST API
function fetchTimeline() {
    fetch('http://localhost:3000/timeline')
        .then(response => response.json())
        .then(data => {
            const timelineDiv = document.getElementById('timeline');
            //use template engine to render each entry
            timelineDiv.innerHTML = data.map(entry => tEngine.renderTemplate(entry)).join('');
        })
        .catch(error => console.error('Error fetching timeline:', error));
}

//fetch timeline data and inject each entry into its matching section in history.html
function fetchHistoryTimeline() {
    fetch('http://localhost:3000/timeline')
        .then(response => response.json())
        .then(data => {
            data.forEach(entry => {
                const section = document.getElementById(entry.year);
                if (section) {
                    section.querySelector('.timeline-data').innerHTML = tEngine.renderTemplate(entry);
                }
            });
        })
        .catch(error => console.error('Error fetching history timeline:', error));
}

//get entries by year function (for entries by year selection)
function getEntriesByYear(event) {
    event.preventDefault();
    const year = event.target.yearFilter.value;
    //fetch data 
    fetch(`http://localhost:3000/year/${year}`)
        .then(response => response.json())
        .then(data => {
            const entriesByYearDiv = document.getElementById('entriesByYear');
            //error check
            if (data.length === 0) {
                entriesByYearDiv.innerHTML = '<p>No entries found for this year.</p>';
            } else {
                //use template engine to render filtered entries (without text paragraph and year)
                entriesByYearDiv.innerHTML = data.map(entry => {
                    const entryNoText = Object.assign({}, entry);
                    delete entryNoText.text;
                    delete entryNoText.year;
                    return tEngine.renderTemplate(entryNoText);
                }).join('');
            }
        })
        .catch(error => console.error('Error fetching entries by year:', error));
}