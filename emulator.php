<?php
/******************************************************************************
 * SELLQUIZ-LANGUAGE-WORKBENCH                                                *
 *                                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 *                                                                            *
 * Partly funded by: Digitale Hochschule NRW                                  *
 * https://www.dh.nrw/kooperationen/hm4mint.nrw-31                            *
 *                                                                            *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 *                                                                            *
 * This library is licensed as described in LICENSE, which you should have    *
 * received as part of this distribution.                                     *
 *                                                                            *
 * This software is distributed on "AS IS" basis, WITHOUT WARRENTY OF ANY     *
 * KIND, either impressed or implied.                                         *
 ******************************************************************************/
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Math App</title>

        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">


        <meta http-equiv="content-type" content="text/html; charset=utf-8">

        <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="node_modules/@fortawesome/fontawesome-free/css/all.min.css"/>

        <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script src="node_modules/mathjs/lib/browser/math.js"></script>

        <script>MathJax = {
            loader: {
                load: ['input/tex', 'output/svg', 'ui/menu']
            }
        };
        </script>

        <script type="text/javascript" id="MathJax-script" async src="node_modules/mathjax/es5/startup.js"></script>

        <style>
            html {
               font-size: 15px;
            }
            body {
                padding-top: 64px;
            }
        </style>

        <script src="dist/slw-emulator.min.js"></script>

    </head>

    <body>

        <nav class="navbar navbar-expand-lg  navbar-dark bg-dark px-2 fixed-top">
            <a class="navbar-brand" href="emulator.php">
                &nbsp;<i class="fas fa-users"></i>
            </a>
            <a class="navbar-brand">
                &nbsp; andi &bull; 2135 &bull;
                <span style="color:#d4aa00;">
                    <i class="fas fa-trophy"></i>
                </span>
            </a>
            <a class="navbar-brand" onclick="startChat();">
                &nbsp;<i class="far fa-comments"></i>
            </a>
        </nav>


        <div id="topic">

            <div class="container-fluid bg-white">
                <div class="row">
                    <div class="col text-center">
                        <h1 class="display-2">Komplexe Zahlen</h1>
                    </div>
                </div>

                <div class="row mx-2 my-2">
                    <button type="button" class="btn btn-outline-dark text-start" onclick="openCoursePage();">
                        <span class="lead">1. Grundlagen</span>

                        <div id="text-progress" class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 80%; background-color:#cd121b;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 50%; background-color:#e85b22;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 33%; background-color:#b42b83;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>

                    </button>
                </div>
                <div class="row mx-2 my-2">
                    <button type="button" class="btn btn-outline-secondary text-secondary text-start">
                        <span class="lead">2. Komplexe Folgen u. Grenzwerte</span> &nbsp; <i class="fas fa-lock"></i>
                    </button>
                </div>
                <div class="row mx-2 my-2">
                    <button type="button" class="btn btn-outline-secondary text-secondary text-start">
                        <span class="lead">3. Komplexe Reihen</span> &nbsp; <i class="fas fa-lock"></i>
                    </button>
                </div>
                <div class="row mx-2 my-2">
                    <button type="button" class="btn btn-outline-secondary text-secondary text-start">
                        <span class="lead">4. Komplexe Funktionen u. Potenzreihen</span> &nbsp; <i class="fas fa-lock"></i>
                    </button>
                </div>
                <div class="row mx-2 my-2">
                    <button type="button" class="btn btn-outline-secondary text-secondary text-start">
                        <span class="lead">5. Komplexe Potenzen u. Wurzeln</span> &nbsp; <i class="fas fa-lock"></i>
                    </button>
                </div>
            </div>

        </div>

        <div id="chat">

            <div class="container-fluid bg-white">
                <div class="row">
                    <div class="col text-center">
                        <h1 class="display-2">Mathe <i class="fas fa-users"></i> Buddy</h1>
                    </div>
                </div>
            </div>

            <div id="chat-history" class="container-fluid bg-white my-2">
            </div>

            <div class="container-fluid bg-white my-3">
                <div class="row">
                    <div class="col-2">
                    </div>
                    <div class="col text-end">
                        <div class="input-group mb-3">
                            <input id="chatInputField" type="text" class="form-control py-1 my-0 mx-0" placeholder="Nachricht eingeben" size="25"/>
                            <button id="chatInputButton" type="text" class="btn btn-primary py-1 my-0 mx-0"><i class="fas fa-reply"></i></button>
                        </div>
                    </div>
                </div>
            </div>

        </div>



        <div id="overview">

            <div class="container-fluid bg-white">
                <div class="row">
                    <div class="col text-center">
                        <h1 class="display-2">Mathe <i class="fas fa-users"></i> Buddy</h1>
                    </div>
                </div>
            </div>

            <div class="container-fluid bg-dark">

                <div class="py-1">
                </div>

                <div class="row text-light py-1">
                    <h2>Awards</h2>
                </div>
                <div class="row py-0">
                    <div class="col text-center text-white py-0" style="font-size: 32pt">
                        <i class="fas fa-running"></i>
                        &nbsp;
                        <i class="fas fa-hourglass"></i>
                        &nbsp;
                        <i class="fas fa-award"></i>
                        &nbsp;
                        <i class="fas fa-medal"></i>
                    </div>
                </div>
            </div>

            <div class="py-2">
            </div>

            <div class="container-fluid bg-white">
                <div class="row">
                    <div class="col">
                        <h2>Empfehlungen</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <button type="button" class="btn btn-dark">Komplexe Reihen</button>
                        <button type="button" class="btn btn-dark">Partielle Integration</button>
                    </div>
                </div>
            </div>


            <div class="py-2">
            </div>

            <div class="container-fluid bg-dark mx-0 px-0" style="cursor:pointer;">

                <div class="row mx-0">

                    <div class="py-1">
                    </div>

                    <div class="row text-light py-1">
                        <h2>Themen</h2>
                    </div>

                    <div class="col bg-white rounded mx-1 my-1 py-1" onclick="openTopic();">
                        <div class="row my-1">
                            <div class="col">
                                <span class="text-dark">Komplexe<br/> Zahlen</span>
                            </div>
                            <div class="col text-end fw-lighter" style="font-size: 18pt;">
                                54 &#37;
                            </div>
                        </div>
                        <div id="text-progress" class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 80%; background-color:#cd121b;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 50%; background-color:#e85b22;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 33%; background-color:#b42b83;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="col bg-white rounded mx-1 my-1 py-1">
                        <div class="row my-1">
                            <div class="col">
                                <span class="text-dark">Integral-<br/> Rechnung</span>
                            </div>
                            <div class="col text-end fw-lighter" style="font-size: 18pt;">
                                15 &#37;
                            </div>
                        </div>
                        <div id="text-progress" class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 33%; background-color:#cd121b;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 10%; background-color:#e85b22;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 2%; background-color:#b42b83;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>

                <div class="row mx-0">
                    <div class="col bg-white rounded mx-1 my-0 py-1" onclick="openTopic();">
                        <div class="row my-1">
                            <div class="col">
                                <span class="text-dark">Komplexe<br/> Zahlen</span>
                            </div>
                            <div class="col text-end fw-lighter" style="font-size: 18pt;">
                                54 &#37;
                            </div>
                        </div>
                        <div id="text-progress" class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 80%; background-color:#cd121b;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 50%; background-color:#e85b22;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 33%; background-color:#b42b83;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="col bg-white rounded mx-1 my-0 py-1">
                        <div class="row my-1">
                            <div class="col">
                                <span class="text-dark">Integral-<br/> Rechnung</span>
                            </div>
                            <div class="col text-end fw-lighter" style="font-size: 18pt;">
                                15 &#37;
                            </div>
                        </div>
                        <div id="text-progress" class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 33%; background-color:#cd121b;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 10%; background-color:#e85b22;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 2%; background-color:#b42b83;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>

                <div class="row mx-0">
                    <div class="col bg-white rounded mx-1 my-1 py-1" onclick="openTopic();">
                        <div class="row my-1">
                            <div class="col">
                                <span class="text-dark">Komplexe<br/> Zahlen</span>
                            </div>
                            <div class="col text-end fw-lighter" style="font-size: 18pt;">
                                54 &#37;
                            </div>
                        </div>
                        <div id="text-progress" class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 80%; background-color:#cd121b;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 50%; background-color:#e85b22;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 33%; background-color:#b42b83;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="col bg-white rounded mx-1 my-1 py-1">
                        <div class="row my-1">
                            <div class="col">
                                <span class="text-dark">Integral-<br/> Rechnung</span>
                            </div>
                            <div class="col text-end fw-lighter" style="font-size: 18pt;">
                                15 &#37;
                            </div>
                        </div>
                        <div id="text-progress" class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 33%; background-color:#cd121b;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 10%; background-color:#e85b22;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress bg-white" style="height: 8px;">
                            <div class="progress-bar" role="progressbar" style="height: 6px; width: 2%; background-color:#b42b83;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>

                <div class="row mx-0">
                    <div class="col bg-dark rounded mx-1 my-0 py-1" onclick="openTopic();">
                    </div>
                </div>

                <div class="py-1">
                </div>

            </div>

        </div>

        <div id="coursePage">
            <div class="container-fluid bg-white">
                <div class="row">
                    <div class="col">
                        <!--<nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#">Grundlagen</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Komplexe Zahlen</li>
                            </ol>
                        </nav>-->
                        <div id="progress-bars">
                        </div>
                        <div class="py-1">
                        </div>
                    </div>
                </div>
            </div>

            <div id="content">
            </div>
        </div>

        <script>

            let chatInputField = document.getElementById('chatInputField');
            let chatInputButton = document.getElementById('chatInputButton');

            let overview = document.getElementById('overview');

            let page = document.getElementById('coursePage');
            page.style.display = 'none';

            let chat = document.getElementById('chat');
            chat.style.display = 'none';

            let topic = document.getElementById('topic');
            topic.style.display = 'none';

            function openCoursePage() {
                overview.style.display = 'none';
                page.style.display = 'block';
                chat.style.display = 'none';
                topic.style.display = 'none';
            }

            function openTopic() {
                overview.style.display = 'none';
                page.style.display = 'none';
                chat.style.display = 'none';
                topic.style.display = 'block';
            }

            function putChatHistory() {
                let chatHistory = slwEMU.getChatHistory();
                let chatHistoryElement = document.getElementById('chat-history');
                let html = '';
                for(let i=0; i<chatHistory.length; i++) {
                    let message = chatHistory[i];
                    let align = i%2==0 ? 'start' : 'end';
                    let icon = i%2==0 ? '<i class="far fa-comments"></i>&nbsp;' : '';
                    html += `
                    <div class="row py-1">
                        <div class="col text-` + align +`">
                            <button type="button" class="btn btn-outline-dark">
                                ` + icon + message + `
                            </button>
                        </div>
                    </div>
                    `;
                }
                chatHistoryElement.innerHTML = html;
            }

            function sentChatMessage(event) {
                slwEMU.chat(chatInputField.value);
                putChatHistory();
                chatInputField.value = '';
                window.scrollTo(0, document.body.scrollHeight);
                chatInputField.focus();
            }

            function startChat() {
                putChatHistory();
                overview.style.display = 'none';
                page.style.display = 'none';
                chat.style.display = 'block';
                topic.style.display = 'none';
                chatInputField.addEventListener('keydown', (event) => {
                    if(event.key === 'Enter' && chatInputField.value.trim().length > 0) {
                        sentChatMessage();
                    }
                });
                chatInputButton.addEventListener('click', () => {
                    if(chatInputField.value.trim().length > 0) {
                        sentChatMessage();
                    }
                });
                chatInputField.focus();
            }

            slwEMU.init();

            /*let input = document.getElementById("input1");
            input.addEventListener('keyup', function(event){
                console.log(input.value.trim());
                if(input.value.trim() === '-1') {
                    input.style.borderStyle = 'solid';
                    input.style.borderColor = '#00aa00';
                    input.style.borderWidth = "medium";
                } else {
                    input.style.borderStyle = 'solid';
                    input.style.borderColor = '#aa0000';
                    input.style.borderWidth = "medium";
                }
            })

            function mark_read() {
                document.getElementById("smiley").innerHTML = '<i class="far fa-smile-beam"></i>';
                document.getElementById("text-progress").innerHTML =
                    '<div class="progress-bar bg-dark" role="progressbar" style="width: 33%" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100">Text</div>';
            }*/

        </script>

        <script>
            // tooltip handling
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
            function hide_tooltips() {
                for(let tooltip of tooltipList)
                    tooltip.hide();
            }
        </script>

    </body>

</html>
