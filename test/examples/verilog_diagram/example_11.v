module nonansimodule (
    pc_out,
    pmem_en,
    act_en,
    pc_in,
    stop_pc
  );
  parameter ADDR_WIDTH = 8;              //! Address-bus width.

  output reg [ADDR_WIDTH-1:0] pc_out;     //! Output 
  output reg pmem_en,act_en;              //! Enable
  input [ADDR_WIDTH-1:0] pc_in;           //! Input
  input stop_pc;                          //! Stop


  reg stop_flag;

endmodule
