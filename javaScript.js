async function receiveInput()
    {
      var sentences = document.getElementById("sentenceinput").value;
      sentences = sentences.replace(/(\r\n|\n|\r)/gm,"");

      if (sentences.length < 10){
        document.getElementById("error message").style.display = "block";
        return;
      }

      document.getElementById("error message").style.display = "none";

      await fetch('https://1fthxf9xul.execute-api.us-east-2.amazonaws.com/default/web-compliance-validator',{
        method: 'POST',
        headers: {
            'x-api-key': "qiRgQE7dSq8SBtygCHFdF1GHWtrOrJfi9WKmCdfA"
        },
        body: `{
                "input": "${sentences}"
                }`   
    })

    window.location.replace("outputResults.html");
      /**.then(response => response.text())
      .then((response) => updateResponse(response))
      .catch(error => console.error(error)); */

    }

async function getJobList(input){
    const response = await fetch('https://yh8lubu6m4.execute-api.us-east-2.amazonaws.com/default/web-compliance-function',{
        method: 'POST',
        body: `{
            "option": "${input}"
            }`
    })
    const formatted = await response.json();
    return formatted;
}

async function parseJobList(){
    document.getElementById("completed").innerHTML = buildCompletedHTML(await getJobList("COMPLETED"));
    let jobList = await getJobList("COMPLETED");
    jobList.sort(sortByTime("SubmitTime"));
    for (var i = 0; i < 1; i++){
        document.getElementById("output" + i).innerHTML = await getCompliance(jobList[i].JobId);
    }
}

async function parseInProgress(){
    //var test = [{"SubmitTime": "2021-07-16 18:01:34", "Results": "a"}, {"SubmitTime": "2021-07-16 18:01:34", "Results:": "b"}];
    document.getElementById("in-progress").innerHTML = buildProgressHTML(await getJobList("IN_PROGRESS"));
    //document.getElementById("in-progress").innerHTML = buildProgressHTML(test);
}

function sortByTime(time){
    return function(first, second){
        if (first[time] > second[time]){
            return -1;
        }
        return 1;
    }
}

async function getCompliance(JobId){
    const bucket = "web-compliance-training-data-2";
    const input = "InputData/job.txt";
    var output = "OutputData/575936835891-CLN-" + JobId + "/output/output.tar.gz";

    const response = await fetch('https://ojtr24vaal.execute-api.us-east-2.amazonaws.com/default/web-comprehend-job-result', {
        method: 'POST',
        body: `{
                "userFile": {
                    "bucket": "${bucket}",
                    "key": "${input}"
                },
                "outputFile": {
                    "bucket": "${bucket}",
                    "key": "${output}"
                }
            }`
    })
    let result = await response.json();
    return result;
}

function buildCompletedHTML(json){
    if (json.length > 0){
        let display = `<br><table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col-sm" class = "text-center">Time</th>
                            <th scope="col-sm" class = "text-center">Status</th>
                            <th scope="col-sm" class = "text-center">Analysis</th>
                        </tr>
                    </thead>
                    <tbody>`;

        json.sort(sortByTime("SubmitTime"));

        for (var i = 0; i < 1; i++){
            var job = JSON.parse(JSON.stringify(json[i]));
            var time = job.SubmitTime.slice(0, 19);

            var jobID = job.JobId;

            display += `<tr><th scope="row"><h6 class="text-muted text-center font-weight-normal col-table">${time}</h6></th>
                        <td><p class = "text-center col-table"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                        </svg></p></td>
                        <td><p class = "lead text-center col-table"><a href = "#output${i}" data-toggle="collapse" aria-expanded="false" aria-controls="collapseExample" 
                        class = "btn btn-primary" id = "search${i}">View</a></p></td>
                        <tr class = "no-border"><td colspan = "3"><div class="collapse" id="output${i}">
                        <div class="card card-body">
                        </div></td>`;
        }

        display += "</tbody></table>";
        return display;
    }
    else{
        let display = `<h6 class="text-muted text-center font-weight-normal">No Completed Jobs Available</h6>`;
        return display;
    }
    
}   

function buildProgressHTML(json){
    if (json.length > 0){
        let display = `<br><table class="table table-hover">
        <thead>
            <tr>
                <th scope="col-sm" class = "text-center">Time</th>
                <th scope="col-sm" class = "text-center">Status</th>
                <th scope="col-sm" class = "text-center">Analysis</th>
            </tr>
        </thead>
        <tbody>`;

        json.sort(sortByTime("SubmitTime"));

        for (var i = 0; i < json.length; i++){
            var job = JSON.parse(JSON.stringify(json[i]));
            var time = job.SubmitTime.slice(0, 19);


            display += `<tr><th scope="row"><h6 class="text-muted text-center font-weight-normal">${time}</h6></th>
                    <td class = "text-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-square-dots" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg></td>
                    <td><p class = "lead text-center"><a href = "#/" class = "btn btn-disabled" id = "progressButton">View</a></p></td>`
        }

        display += "</tbody></table>";
        return display;
    }
    else{
        let display = `<h6 class="text-muted text-center font-weight-normal">No In-Progress Jobs Available</h6>`;
        return display;
    }
}

function disableProgressButton(){
    document.getElementById("progressButton").disabled = true;
}
