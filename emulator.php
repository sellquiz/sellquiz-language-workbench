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
                    <button type="button" class="btn btn-outline-dark" onclick="openCoursePage();">
                        <span class="lead">Grundlagen</span>

                        <div id="text-progress" class="progress">
                            <div class="progress-bar bg-dark" role="progressbar" style="width: 80%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">Text</div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-primary" role="progressbar" style="width: 50%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">Übungen</div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 33%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Spiele</div>
                        </div>

                    </button>
                </div>
                <div class="row mx-2 my-2">
                    <button type="button" class="btn btn-outline-dark">
                        <span class="lead"><i class="fas fa-lock"></i> &nbsp; Komplexe Folgen und Grenzwerte</span>
                    </button>
                </div>
                <div class="row mx-2 my-2">
                    <button type="button" class="btn btn-outline-dark">
                        <span class="lead"><i class="fas fa-lock"></i> &nbsp; Komplexe Reihen</span>
                    </button>
                </div>
                <div class="row mx-2 my-2">
                    <button type="button" class="btn btn-outline-dark">
                        <span class="lead"><i class="fas fa-lock"></i> &nbsp; Komplexe Funktionen und Potenzreihen</span>
                    </button>
                </div>
                <div class="row mx-2 my-2">
                    <button type="button" class="btn btn-outline-dark">
                        <span class="lead"><i class="fas fa-lock"></i> &nbsp; Komplexe Potenzen und Wurzeln</span>
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

            <div class="container-fluid bg-white my-2">
                <div class="row">
                    <div class="col text-start">
                        <button type="button" class="btn btn-outline-dark">
                            <i class="far fa-comments"></i>
                            Wie kann ich Dir helfen?
                        </button>
                    </div>
                </div>
            </div>

            <div class="container-fluid bg-white my-2">
                <div class="row">
                    <div class="col text-end">
                        <input id="chatInputField" type="text" class="mx-1" placeholder="Nachricht eingeben" size="25"/>
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
                        <div id="text-progress" class="progress">
                            <div class="progress-bar bg-dark" role="progressbar" style="width: 80%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-primary" role="progressbar" style="width: 50%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 33%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
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
                        <div id="text-progress" class="progress">
                            <div class="progress-bar bg-dark" role="progressbar" style="width: 33%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-primary" role="progressbar" style="width: 10%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 2%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
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
                        <div id="text-progress" class="progress">
                            <div class="progress-bar bg-dark" role="progressbar" style="width: 80%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-primary" role="progressbar" style="width: 50%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 33%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
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
                        <div id="text-progress" class="progress">
                            <div class="progress-bar bg-dark" role="progressbar" style="width: 33%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-primary" role="progressbar" style="width: 10%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 2%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
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
                        <div id="text-progress" class="progress">
                            <div class="progress-bar bg-dark" role="progressbar" style="width: 80%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-primary" role="progressbar" style="width: 50%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 33%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
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
                        <div id="text-progress" class="progress">
                            <div class="progress-bar bg-dark" role="progressbar" style="width: 33%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-primary" role="progressbar" style="width: 10%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-danger" role="progressbar" style="width: 2%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
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
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#">Grundlagen</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Komplexe Zahlen</li>
                            </ol>
                        </nav>
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

            function startChat() {
                overview.style.display = 'none';
                page.style.display = 'none';
                chat.style.display = 'block';
                topic.style.display = 'none';
                let chatInputField = document.getElementById('chatInputField');
                chatInputField.focus();
                chatInputField.addEventListener('keydown', (event)=>{
                    if(event.key === 'Enter') {
                        console.log('blub')
                    }
                })
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
