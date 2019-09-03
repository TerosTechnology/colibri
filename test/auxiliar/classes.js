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
