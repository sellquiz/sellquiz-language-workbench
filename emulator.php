<?php
/******************************************************************************
 * MATHE BUDDY APP                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
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

        <script src="dist/slw-emulator.min.js?version=<?php echo time();?>" ></script>

    </head>

    <body>

        <nav class="navbar navbar-expand-lg  navbar-dark bg-dark px-2 fixed-top">
            <span>
                <a class="navbar-brand" href="emulator.php">
                    &nbsp;<i class="fas fa-users"></i>
                </a>
                <a class="navbar-brand" href="emulator.php">
                    &nbsp;
                    <i class="fas fa-bullseye"></i>
                </a>
            </span>
            <a class="navbar-brand">
                &nbsp; andi &bull; 2135 &bull;
                <span style="color:#d4aa00;">
                    <i class="fas fa-trophy"></i>
                </span>
            </a>
            <a class="navbar-brand" onclick="startChat();" style="cursor: pointer;">
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

                <div class="row mx-0 my-2 text-center">
                    <button type="button" class="btn btn-dark" onclick="openCoursePage();">
                        <span class="lead">1. Grundlagen</span>
                        <div class="row text-center px-0">
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 25%; max-width: 25%; background-color:#cd121b;"></div></div>
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 15%; max-width: 15%; background-color:#e85b22;"></div></div>
                            <div class="d-flex justify-content-center"><div style="height: 6px; width: 100%; max-width: 100%; background-color:#b42b83;"></div></div>
                        </div>
                        <div class="row py-1">
                        </div>
                    </button>
                </div>

                <div class="row text-center">
                    <i class="fas fa-chevron-down"></i>
                </div>

                <div class="row mx-0 my-2 text-center">
                    <button type="button" class="btn btn-dark" onclick="">
                        <span class="lead">2. Komplexe Folgen u. Grenzwerte</span> &nbsp;
                        <br/>
                        <span style="font-size:16pt">
                            <i class="fas fa-lock"></i>
                        </span>
                        <div class="row py-1">
                        </div>
                    </button>
                </div>

                <div class="row text-center">
                    <i class="fas fa-chevron-down"></i>
                </div>

                <div class="row mx-0 my-2 text-center">
                    <button type="button" class="btn btn-dark" onclick="">
                        <span class="lead">3. Komplexe Reihen</span> &nbsp;
                        <br/>
                        <span style="font-size:16pt">
                            <i class="fas fa-lock"></i>
                        </span>
                        <div class="row py-1">
                        </div>
                    </button>
                </div>

                <div class="row text-center">
                    <i class="fas fa-chevron-down"></i>
                </div>

                <div class="row mx-0 my-2 text-center">
                    <button type="button" class="btn btn-dark" onclick="">
                        <span class="lead">4. Komplexe Funktionen und Potenzreihen</span> &nbsp;
                        <br/>
                        <span style="font-size:16pt">
                            <i class="fas fa-lock"></i>
                        </span>
                        <div class="row py-1">
                        </div>
                    </button>
                </div>

                <div class="row text-center">
                    <i class="fas fa-chevron-down"></i>
                </div>

                <div class="row mx-0 my-2 text-center">
                    <button type="button" class="btn btn-dark" onclick="">
                        <span class="lead">5. Komplexe Potenzen u. Wurzeln</span> &nbsp;
                        <br/>
                        <span style="font-size:16pt">
                            <i class="fas fa-lock"></i>
                        </span>
                        <div class="row py-1">
                        </div>
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
                            <input id="chatInputField" type="text" class="form-control py-1 my-0 mx-0 border-dark" placeholder="Nachricht eingeben" size="25"/>
                            <button id="chatInputButton" type="text" class="btn btn-dark py-1 my-0 mx-0"><i class="fas fa-reply"></i></button>
                        </div>
                    </div>
                </div>
            </div>

        </div>



        <div class="container" id="overview">

            <div class="container-fluid bg-white">
                <div class="row">
                    <div class="col text-center">
                        <h1 class="display-2">Mathe <i class="fas fa-users"></i> Buddy</h1>
                    </div>
                </div>
            </div>

            <div class="container-fluid bg-dark" style="border-style: solid; border-radius: 14px;">

                <!--<div class="row text-light py-1">
                    &nbsp;&nbsp;Awards
                </div>-->

                <div class="row text-light py-1">
                </div>

                <div class="row text-center px-5">
                    <table class="table table-sm text-light">
                        <tr class="text-end" style="vertical-align:bottom;">
                            <td class="text-center">
                                <div style="background-color: green; height:20px;vertical-align:bottom; min-width:24px;">
                                </div>
                            </td>
                            <td class="text-center">
                                <div style="background-color: green; height:45px;vertical-align:bottom; min-width:24px;">
                                </div>
                            </td>
                            <td class="text-center">
                            <div style="background-color: green; height:33px;vertical-align:bottom; min-width:24px;">
                                </div>
                            </td>
                            <td class="text-center">
                                <div style="background-color: green; height:48px;vertical-align:bottom; min-width:24px;">
                                    <!--<span style="color:#006500;">
                                        <i class="far fa-smile-beam"></i>
                                    </span>-->
                                </div>
                            </td>
                            <td class="text-center">
                                <div style="background-color: green; height:1px;vertical-align:bottom; min-width:24px;">
                                </div>
                            </td>
                            <td class="text-center">
                                <div style="background-color: green; height:10px;vertical-align:bottom; min-width:24px;">
                                </div>
                            </td>
                            <td class="text-center">
                                <div style="background-color: green; height:32px;vertical-align:bottom; min-width:24px;">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Mo</td>
                            <td>Di</td>
                            <td>Mi</td>
                            <td>Do</td>
                            <td>Fr</td>
                            <td>Sa</td>
                            <td>So</td>
                        </tr>
                    </table>
                </div>

                <p class="text-light fw-light text-center py-0">
                    <i class="fas fa-heartbeat"></i> 77 &#x25;
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <i class="far fa-check-circle"></i> 50 &#x25;
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <i class="far fa-hourglass"></i> 60 &#x25;
                </p>

                <div class="row py-0">
                    <div class="col text-center text-white py-0" style="font-size: 24pt">
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

            <div class="row py-1">
            </div>

            <div class="container-fluid bg-dark" style="border-style: solid; border-radius: 14px;">
                <div class="row">
                    <div class="col text-center text-white fw-light py-1">
                        Empfehlungen
                    </div>
                </div>
                <div class="row">
                    <div class="col text-center">
                        <button type="button" class="btn" style="background-color:#cd121b;color:#ffffff;font-size:20px;">
                            <i class="far fa-file-alt"></i>
                        </button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button type="button" class="btn" style="background-color:#e85b22;color:#ffffff;font-size:20px;">
                            <i class="fas fa-tasks"></i>
                        </button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button type="button" class="btn" style="background-color:#b42b83;color:#ffffff;font-size:20px;">
                            <i class="fas fa-gamepad"></i>
                        </button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button type="button" class="btn" style="background-color:#ffffff;color:#080808;font-size:20px;">
                            <i class="fas fa-random"></i>
                        </button>
                    </div>
                </div>
                <div class="row py-1">
                </div>
            </div>

            <div class="row py-1">
            </div>

            <!--<div class="container-fluid bg-white">
                <div class="row">
                    <div class="col text-center">
                        <b>Kurs: Höhere Mathematik</b>
                    </div>
                </div>
            </div>-->

            <div class="container-fluid bg-dark mx-0 px-0 px-1 py-0 my-0" style="cursor:pointer;border-style: solid; border-radius: 14px;">

                <div class="row text-center">
                    <span class="text-light py-1 text-center">Kurs: Höhere Mathematik</span>
                </div>

                <div class="row mx-0 my-0 text-center">
                    <div class="col bg-dark mx-0 my-0 py-1" onclick="openTopic();" style="border-bottom-style: solid; border-right-style: solid; border-color: #ffffff; border-width:1px;">
                        <div class="row my-1">
                            <div class="col">
                                <span class="text-light fw-light">Grundlagen</span>
                            </div>
                        </div>
                        <div class="row text-center px-0">
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 100%; max-width: 100%; background-color:#cd121b;"></div></div>
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 75%; max-width: 75%; background-color:#e85b22;"></div></div>
                            <div class="d-flex justify-content-center"><div style="height: 6px; width: 30%; max-width: 80%; background-color:#b42b83;"></div></div>
                        </div>
                        <div class="row py-1">
                        </div>
                    </div>
                    <div class="col bg-dark mx-0 my-0 py-1" onclick="openTopic();" style="border-bottom-style: solid; border-color: #ffffff; border-width:1px;">
                        <div class="row my-1">
                            <div class="col">
                                <span class="text-light fw-light">Komplexe Zahlen</span>
                            </div>
                        </div>
                        <div class="row text-center px-0">
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 70%; max-width: 70%; background-color:#cd121b;"></div></div>
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 50%; max-width: 50%; background-color:#e85b22;"></div></div>
                            <div class="d-flex justify-content-center"><div style="height: 6px; width: 85%; max-width: 85%; background-color:#b42b83;"></div></div>
                        </div>
                        <div class="row py-1">
                        </div>
                    </div>
                </div>

                <div class="row mx-0 my-0 text-center">
                    <div class="col bg-dark mx-0 my-0 py-1" onclick="openTopic();" style="border-bottom-style: solid; border-right-style: solid; border-color: #ffffff; border-width:1px;">
                        <div class="row my-1">
                            <div class="col">
                                <span class="text-light fw-light">Differentialrechnung</span>
                            </div>
                        </div>
                        <div class="row text-center px-0">
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 20%; max-width: 20%; background-color:#cd121b;"></div></div>
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 10%; max-width: 10%; background-color:#e85b22;"></div></div>
                            <div class="d-flex justify-content-center"><div style="height: 6px; width: 3%; max-width: 3%; background-color:#b42b83;"></div></div>
                        </div>
                        <div class="row py-1">
                        </div>
                    </div>
                    <div class="col bg-dark mx-0 my-0 py-1" onclick="openTopic();" style="border-bottom-style: solid; border-color: #ffffff; border-width:1px;">
                        <div class="row my-1">
                            <div class="col">
                                <span class="text-light fw-light">Integralrechnung</span>
                            </div>
                        </div>
                        <div class="row text-center px-0">
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 2%; max-width: 2%; background-color:#cd121b;"></div></div>
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 2%; max-width: 2%; background-color:#e85b22;"></div></div>
                            <div class="d-flex justify-content-center"><div style="height: 6px; width: 2%; max-width: 2%; background-color:#b42b83;"></div></div>
                        </div>
                        <div class="row py-1">
                        </div>
                    </div>
                </div>

                <div class="row mx-0 my-0 text-center">
                    <div class="col bg-dark mx-0 my-0 py-1" onclick="openTopic();" style="border-right-style: solid; border-color: #ffffff; border-width:1px;">
                        <div class="row my-1">
                            <div class="col">
                                <span class="text-light fw-light">Lineare Algebra</span>
                            </div>
                        </div>
                        <div class="row text-center px-0">
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 2%; max-width: 2%; background-color:#cd121b;"></div></div>
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 2%; max-width: 2%; background-color:#e85b22;"></div></div>
                            <div class="d-flex justify-content-center"><div style="height: 6px; width: 2%; max-width: 2%; background-color:#b42b83;"></div></div>
                        </div>
                        <div class="row py-1">
                        </div>
                    </div>
                    <div class="col bg-dark mx-0 my-0 py-1" onclick="openTopic();" style="border-color: #ffffff; border-width:1px;">
                        <div class="row my-1">
                            <div class="col">
                                <span class="text-light fw-light">DGLs</span>
                            </div>
                        </div>
                        <div class="row text-center px-0">
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 2%; max-width: 2%; background-color:#cd121b;"></div></div>
                            <div class="d-flex justify-content-center mb-1"><div style="height: 6px; width: 2%; max-width: 2%; background-color:#e85b22;"></div></div>
                            <div class="d-flex justify-content-center"><div style="height: 6px; width: 2%; max-width: 2%; background-color:#b42b83;"></div></div>
                        </div>
                        <div class="row py-1">
                        </div>
                    </div>
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
                    let isBuddy = message.startsWith('B');
                    message = message.substring(2); // remove prefix
                    let align = isBuddy ? 'start' : 'end';
                    let icon = isBuddy ? '<i class="far fa-comments"></i>&nbsp;' : '';
                    html += `
                    <div class="row py-1">
                        <div class="col text-` + align +`">
                            <button type="button" class="btn btn-outline-dark" style="max-width:90%";>
                                ` + icon + message + `
                            </button>
                        </div>
                    </div>
                    `;
                }
                chatHistoryElement.innerHTML = html;
            }

            function sendChatMessage(event) {
                slwEMU.sendChatMessage(chatInputField.value);
                putChatHistory();
                chatInputField.value = '';
                //window.scrollTo(0, document.body.scrollHeight);
                chatInputField.focus();
            }

            function startChat() {
                overview.style.display = 'none';
                page.style.display = 'none';
                chat.style.display = 'block';
                topic.style.display = 'none';
                putChatHistory();
                chatInputField.addEventListener('keydown', (event) => {
                    if(event.key === 'Enter' && chatInputField.value.trim().length > 0) {
                        sendChatMessage();
                    }
                });
                chatInputButton.addEventListener('click', () => {
                    if(chatInputField.value.trim().length > 0) {
                        sendChatMessage();
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
