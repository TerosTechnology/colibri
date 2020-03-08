// Copyright 2020
//
// Ismael Perez Rojo (ismaelprojo@gmail.com)
// Carlos Alberto Ruiz Naranjo (carlosruiznaranjo@gmail.com)
//
// This file is part of Colibri.
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

class A {
  constructor(){
    this.vaa = 2
    console.log('cont A');
  }

  f1(){
    console.log('f1a');
  }

  f2(){
    console.log(this.my_var);
    console.log(this.vaa);
  }

}


class B extends A{
  constructor(){
    super();
    this.vaa = 67
    this.my_var = '2'
    console.log('cont b');

  }

  f1(){
    console.log('f1b');
  }

}


new B().f2()
