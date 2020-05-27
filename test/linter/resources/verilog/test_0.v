module bug2 (input a, input b, input c, output d);
  wire e;
  assign d = c & e;
endmodule

module top ();s
  wire mon;
  bug2 inst (.a(1'b1), .b(1'b1), .d(mon));
endmodule