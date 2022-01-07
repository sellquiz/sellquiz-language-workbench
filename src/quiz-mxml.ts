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

export const moodle_XML_stack_template = `
<?xml version="1.0" encoding="UTF-8"?>
<quiz>
  <question type="stack">
    <name>
      <text>@TITLE@</text>
    </name>
    <questiontext format="html">
      <text><![CDATA[@QUESTION_TEXT@]]></text>
    </questiontext>
    <generalfeedback format="html">
      <text><![CDATA[@SOLUTION@]]></text>
    </generalfeedback>
    <defaultgrade>1</defaultgrade>
    <penalty>0.1</penalty>
    <hidden>0</hidden>
    <idnumber></idnumber>
    <stackversion>
      <text>2020120600</text>
    </stackversion>
    <questionvariables>
      <text>@VARIABLES@</text>
    </questionvariables>
    <specificfeedback format="html">
      <text><![CDATA[<h4><br></h4>]]></text>
    </specificfeedback>
    <questionnote>
      <text>n</text>
    </questionnote>
    <questionsimplify>1</questionsimplify>
    <assumepositive>0</assumepositive>
    <assumereal>0</assumereal>
    <prtcorrect format="html">
      <text>@TEXT_CORRECT@</text>
    </prtcorrect>
    <prtpartiallycorrect format="html">
      <text>@TEXT_PARTIALLY_CORRECT@</text>
    </prtpartiallycorrect>
    <prtincorrect format="html">
      <text>@TEXT_NOT_CORRECT@</text>
    </prtincorrect>
    <multiplicationsign>dot</multiplicationsign>
    <sqrtsign>1</sqrtsign>
    <complexno>i</complexno>
    <inversetrig>cos-1</inversetrig>
    <logicsymbol>lang</logicsymbol>
    <matrixparens>(</matrixparens>
    <variantsselectionseed></variantsselectionseed>
    @INPUTS@
    @PRTS@
    <tags>
      @TAGS
    </tags>
  </question>
</quiz>
`;

export const moodle_XML_stack_template_input = `
    <input>
      <name>ans1</name>
      <type>algebraic</type>
      <tans>ls1</tans>
      <boxsize>@BOXSIZE@</boxsize>
      <strictsyntax>1</strictsyntax>
      <insertstars>0</insertstars>
      <syntaxhint></syntaxhint>
      <syntaxattribute>0</syntaxattribute>
      <forbidwords></forbidwords>
      <allowwords></allowwords>
      <forbidfloat>0</forbidfloat>
      <requirelowestterms>0</requirelowestterms>
      <checkanswertype>0</checkanswertype>
      <mustverify>1</mustverify>
      <showvalidation>1</showvalidation>
      <options></options>
    </input>
`;

export const moodle_XML_stack_template_prt = `
<prt>
      <name>prt1</name>
      <value>1.0000000</value>
      <autosimplify>1</autosimplify>
      <feedbackstyle>1</feedbackstyle>
      <feedbackvariables>
        <text></text>
      </feedbackvariables>
      @NODES@
    </prt>
`;

export const moodle_XML_stack_template_prt_node = `
    <node>
        <name>0</name>
        <answertest>NumAbsolute</answertest>
        <sans>ans1</sans>
        <tans>ls1</tans>
        <testoptions>0.05</testoptions>
        <quiet>0</quiet>
        <truescoremode>=</truescoremode>
        <truescore>1.0000000</truescore>
        <truepenalty></truepenalty>
        <truenextnode>-1</truenextnode>
        <trueanswernote>prt1-1-T</trueanswernote>
        <truefeedback format="html">
          <text></text>
        </truefeedback>
        <falsescoremode>=</falsescoremode>
        <falsescore>0.0000000</falsescore>
        <falsepenalty></falsepenalty>
        <falsenextnode>-1</falsenextnode>
        <falseanswernote>prt1-1-F</falseanswernote>
        <falsefeedback format="html">
          <text></text>
        </falsefeedback>
      </node>
`;
