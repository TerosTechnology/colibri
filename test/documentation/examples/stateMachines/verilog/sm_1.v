always @(posedge clk or posedge reset)
     begin
          if (reset)
               state = zero;
          else
               case (state)
                    zero:
                         state = one;
                    one:
                         if (in) begin
                              state = zero;
                         else
                              state = two;
                    two:
                         state = three;
                    three:
                         state = zero;
               endcase
     end

endmodule
