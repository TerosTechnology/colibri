always@(posedge clk or posedge reset)
begin
  if (reset)
    begin
      state = s1; outp = 1'b1;
    end
  else
    begin
      case (state)
        s1: begin
              if (x1==1'b1) state = s2;
              else          state = s3;
              outp = 1'b1;
            end
        s2: begin
              state = s4; outp = 1'b1;
            end
        s3: begin
              state = s4; outp = 1'b0;
            end
        s4: begin
              state = s1; outp = 1'b0;
            end
      endcase
    end
end  
