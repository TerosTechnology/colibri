const html_style_preview = `
<style>
  table {
    width:90%;
    margin-left: auto;
    margin-right: auto
  }
  svg {
    display:block;  
    width:70%;
    height:70%;
    margin-left: auto;
    margin-right: auto
  }
  h1, h2, h3 {
    margin-left:1.5%;
    width:98%;
    font-weight:bold
  }
  code {
    color:#545253;
  }
  p {
    width: 98%;
    color:black;
    margin-top:5px;
    margin-bottom:5px 
  }
  * {
    color:black;
    line-height: 1.6;
  }
  li{
    margin: 20px 0;
  }
  #function_return{
    font-weight: bold;
    color:green;
  }
  #teroshdl_description, li {
    width: 98%;
    margin-left:2%;
    margin-right:2%;
  }
  #function_arguments{
    color:blue;
  }
  div.templateTerosHDL {
    background-color: white;
    position:absolute;
  }
  td, th {
    padding:7px; 
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


const html_style_save = `
<style>
  table {
    width:70%;
    margin-left: auto;
    margin-right: auto
  }
  svg {
    display:block;  
    width:60%;
    height:40%;
    margin-left: auto;
    margin-right: auto
  }
  h1, h2, h3 {
    margin-left:1.5%;
    width:98%;
    font-weight:bold
  }
  code {
    color:#545253;
  }
  p {
    width: 98%;
    color:black;
    margin-top:5px;
    margin-bottom:5px 
  }
  * {
    color:black;
    line-height: 1.6;
  }
  li{
    margin: 20px 0;
  }
  #function_return{
    font-weight: bold;
    color:green;
  }
  #teroshdl_description, li {
    width: 98%;
    margin-left:2%;
    margin-right:2%;
  }
  #function_arguments{
    color:blue;
  }
  div.templateTerosHDL {
    background-color: white;
    position:absolute;
  }
  td, th {
    padding:7px; 
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
