const html_style_preview = `
<style>
  h1, h2, h3, table, svg, p {
    margin-left:2.5%;
  }
  h1, h2 {
    font-weight:bold;
  }
  p {
    color:black;
    margin-top:5px;
    margin-bottom:5px 
  }
  svg {
    width:100%;
    height:100%;
  }
  #state_machine {
    width:70%;
    height:70%;
    display: block;
    margin: auto;
  }
  code {
    color:#545253;
  }
  * {
    color:black;
  }
  #function_return{
    font-weight: bold;
    color:green;
  }
  #function_arguments{
    color:blue;
  }
  td, th {
    border: 1px solid grey 
  }
  th {
    background-color: #ffd78c;
  }
  tr:hover {
    background-color: #ddd;
  }
  tr:nth-child(even){
    background-color: #f2f2f2;
  }
</style>\n`;


const html_style_save = `
<style>
  h1, h2, h3, table, svg {
    margin-left:2.5%;
    width:60%
  }
  h1, h2 {
    font-weight:bold
  }
  code {
    color:#545253;
  }
  p {
    color:black;
    margin-top:5px;
    margin-bottom:5px 
  }
  * {
    color:black;
  }
  #function_return{
    font-weight: bold;
    color:green;
  }
  #teroshdl_description, li {
    margin-left:2.5%;
  }
  #function_arguments{
    color:blue;
  }
  div.templateTerosHDL {
    background-color: white;
    position:absolute;
  }
  td, th {
    border: 1px solid grey;
  }
  th {
    background-color: #ffd78c;
  }
  tr:hover {
    background-color: #ddd;
  }
  tr:nth-child(even){
    background-color: #f2f2f2;
  }
</style>\n`;


module.exports = {
  html_style_save: html_style_save,
  html_style_preview: html_style_preview
};
