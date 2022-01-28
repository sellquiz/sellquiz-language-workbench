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

<?php
    session_start();
    if(isset($_SESSION['slw_user']) == false)
        $_SESSION['slw_user'] = 'demo';
    if(isset($_SESSION['slw_error']) == false)
        $_SESSION['slw_error'] = '';
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
        <link rel="stylesheet" href="node_modules/@geedmo/yamm/dist/yamm.css"/>
        <link rel="stylesheet" href="node_modules/@fortawesome/fontawesome-free/css/all.min.css"/>
        <link rel="stylesheet" href="node_modules/codemirror/lib/codemirror.css"/>

        <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script src="node_modules/mathjs/lib/browser/math.js"></script>

        <script src="node_modules/ui-progress-circle/dist/ui-progress-circle/ui-progress-circle.js">

        <script>MathJax = {
            loader: {
                load: ['input/asciimath', 'output/svg', 'ui/menu']
            }
        };
        </script>

        <script type="text/javascript" id="MathJax-script" async src="node_modules/mathjax/es5/startup.js"></script>

        <style>
            html {
               font-size: 15px;
            }
            body { padding-top: 64px; }



        </style>

    </head>

    <body>

    <nav class="navbar navbar-expand-lg navbar-light bg-light px-2 fixed-top">
  <a class="navbar-brand" href="#">andi &bull; 2135 &bull; <span style="color:#d4aa00;"><i class="fas fa-trophy"></i></span> &bull; <i class="fas fa-award"></i></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>

        <div class="container-fluid px-1">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="#">Grundlagen</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Komplexe Zahlen</li>
                </ol>
            </nav>
        </div>

        <div class="container-fluid px-1">
            <h1>Komplexe Zahlen</h1>
            <h2>Einführung</h2>


            <ui-progress-circle></ui-progress-circle>
<ui-progress-circle value="67"></ui-progress-circle>
<ui-progress-circle value="100" color="success"></ui-progress-circle>
<ui-progress-circle value="33" stroke="100"></ui-progress-circle>
<ui-progress-circle shape="round" color="#2266DD" radius="90"></ui-progress-circle>
<ui-progress-circle value="42" class="no-animation"></ui-progress-circle>

            <div class="row d-flex justify-content-center mt-100">
                <div class="col-md-6">
                    <div class="progress blue"> <span class="progress-left"> <span class="progress-bar"></span> </span> <span class="progress-right"> <span class="progress-bar"></span> </span>
                        <div class="progress-value">90%</div>
                    </div>
                    <div class="progress yellow"> <span class="progress-left"> <span class="progress-bar"></span> </span> <span class="progress-right"> <span class="progress-bar"></span> </span>
                        <div class="progress-value">37.5%</div>
                    </div>
                </div>
            </div>

        </div>

        <!--
        <div class="container-fluid px-1">
            <div class="text-center">
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li class="page-item"><a class="page-link" href="#">&laquo;</a></li>
                        <li class="page-item"><a class="page-link" href="#">Einführung</a></li>
                        <li class="page-item"><a class="page-link" href="#">&raquo;</a></li>
                    </ul>
                </nav>
            </div>
        </div>
        -->

        <div class="container-fluid px-1 py-2">
            Über den reellen Zahlen können Gleichungen wie `x^2 = −1` nicht gelöst werden, da keine Quadratwurzeln aus negativen Zahlen existieren.
            Deshalb erweitert man den Zahlbereich auf die sogenannten <b>komplexen Zahlen</b>, die wir später als Ausdrücke der Form `x+y\sqrt{-1}=x+y i` mit `x,y \in \mathbb{R}` darstellen werden.
        </div>


        <div class="container-fluid px-1">
            <div class="card border-dark px-0">
                <!--<img src="..." class="card-img-top" alt="...">-->
                <div class="card-body px-1 py-1">

                    <div class="row">
                        <div class="col">
                            <h5 class="card-title">Definition</h5>
                        </div>
                        <div class="col text-end">
                            <div class="btn-group btn-group-sm" role="group">
                                <button type="button" class="btn btn-sm btn-outline-dark"><i class="fas fa-bookmark"></i></button>
                                <!--<button type="button" class="btn btn-sm btn-outline-dark"><i class="fas fa-bookmark"></i></button>-->
                            </div>
                        </div>
                    </div>

                    <p class="card-text py-0 my-1">
                        Auf dem `\mathbb{R}^2` definieren wir
                        <ul class="px-4">
                            <li>Die <b>Addition</b> durch `(x_1,y_1)+``(x_2,y_2)``=(x_1+x_2,y_1+y_2)`</li>
                            <li>Die <b>Multiplikation</b> `(x_1,y_1)\cdot``(x_2,y_2)``=(x_1 x_2-y_1 y_2,x_1 y_2+x_2 y_1)`</li>
                        </ul>
                    </p>

                </div>
            </div>
        </div>


        <!--<div class="container-fluid px-1 py-2">
            <div class="px-2" style="border-top-style: solid; border-bottom-style: solid; border-color: #c30000; border-radius: 10px;">
                <b>Definition</b> Auf dem `\mathbb{R}^2` definieren wir
                <ul>
                    <li>Die <b>Addition</b> durch `(x_1,y_1)+``(x_2,y_2)``=(x_1+x_2,y_1+y_2)`</li>
                    <li>Die <b>Multiplikation</b> `(x_1,y_1)\cdot``(x_2,y_2)``=(x_1 x_2-y_1 y_2,x_1 y_2+x_2 y_1)`</li>
                </ul>
            </div>
        </div>-->

        <!--<div class="container-fluid text-end">
            <i class="fas fa-bookmark"></i> < !-- TODO: popup "bookmark" -- >
        </div>-->

        <div class="container-fluid px-1 py-2">
            <h4>Beispiel</h4>
            Sei `z_1=2+3i,` `z_2=-3+2i`. Dann gilt:
            <div class="px-1 my-1" style="border-left-style: solid; border-width: 4px; border-color: #bababa;">
                `z_1+z_2`<br/>`=(2-3)+``(3+2i)`<br/>`=-1+5i`
            </div>
            <div class="px-1 my-1" style="border-left-style: solid; border-width: 4px; border-color: #bababa;">
                `z_1-z_2`<br/>`=z_1+(-z_2)`<br/>`=2+3i+(3+(-2)i)`<br/>`=(2+3)+(3+(-2))i`<br/>`=5+i`
            </div>

        </div>


        <div class="container-fluid px-1">
            <div class="card border-dark px-0">
                <!--<img src="..." class="card-img-top" alt="...">-->
                <div class="card-body px-1 py-1">

                    <div class="row">
                        <div class="col">
                            <h5 class="card-title"><i class="fas fa-question-circle"></i></h5>
                        </div>
                        <div class="col text-end">
                            <div class="btn-group btn-group-sm" role="group">
                                <button type="button" class="btn btn-sm btn-outline-dark"><i class="fas fa-sync"></i></button>
                                <!--<button type="button" class="btn btn-sm btn-outline-dark"><i class="fas fa-bookmark"></i></button>-->
                            </div>
                        </div>
                    </div>

                    <p class="card-text py-0 my-1">
                        Sei `z_1=2+3i,` `z_2=-3+2i`. Berechne<br/>
                        <ul class="px-4">
                            <li>
                                `z_1+z_2=`
                                <input id="input1" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                                `+`
                                <input id="input2" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                                `i`
                            </li>
                            <li>
                                `z_1-z_2=`
                                <input id="input3" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                                `+`
                                <input id="input4" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                                `i`
                            </li>
                        </ul>

                        <!--<div class="px-1 my-1" style="border-left-style: solid; border-width: 4px; border-color: #bababa;">
                            `z_1+z_2=`
                                <input id="input1" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                                `+`
                                <input id="input2" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                                `i`
                        </div>
                        <div class="px-1 my-1" style="border-left-style: solid; border-width: 4px; border-color: #bababa;">
                            `z_1-z_2=`
                                <input id="input3" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                                `+`
                                <input id="input4" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                                `i`
                        </div>-->
                    </p>

                </div>
            </div>
        </div>

        <!--<div class="container-fluid px-2 py-2 bg-primary text-white">
            <b style="font-size:18pt;"><i class="fas fa-question-circle"></i></b>
            Sei `z_1=2+3i,` `z_2=-3+2i`. <br/>
            <div class="px-1 my-1" style="border-left-style: solid; border-width: 4px; border-color: #bababa;">
                `z_1+z_2=`
                    <input id="input1" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                    `+`
                    <input id="input2" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                    `i`
            </div>
            <div class="px-1 my-1" style="border-left-style: solid; border-width: 4px; border-color: #bababa;">
                `z_1-z_2=`
                    <input id="input3" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                    `+`
                    <input id="input4" type="text" class="mx-1" aria-describedby="emailHelp" placeholder="" size="5"/>
                    `i`
            </div>
            <div class="text-end">
                <i class="fas fa-sync"></i>
            </div>
        </div>-->


        <div class="container-fluid px-1 py-2">
            <b>Praxis</b>
        </div>


        <script>
            let input = document.getElementById("input1");
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
