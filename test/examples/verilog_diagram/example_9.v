`include "includes.v"
`include "includes1.v"
`include "includes2.v"

module t_gate_switch (L,R,nC,C);
 output L;
 output R;
 output nC;
 output C;

 //Syntax: keyword unique_name (drain. source, gate);
 pmos p1 (L,R,nC);
 nmos p2 (L,R,C);

endmodule
