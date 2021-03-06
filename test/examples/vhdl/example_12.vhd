--! @title Video Core
--! @file example_11.vhd
--! @author el3ctrician (elbadriahmad@gmail.com)
--! @version 0.1
--! @date 2020-07-10
--! 
--! @copyright  Copyright (c) 2021 by TerosHDL
--!              GNU Public License
--!  This program is free software: you can redistribute it and/or modify
--!  it under the terms of the GNU General Public License as published by
--!  the Free Software Foundation, either version 3 of the License, or
--!  (at your option) any later version.
--!  This program is distributed in the hope that it will be useful,
--!  but WITHOUT ANY WARRANTY; without even the implied warranty of
--!  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
--!  GNU General Public License for more details.
--!  You should have received a copy of the GNU General Public License
--!  along with this program.  If not, see <https://www.gnu.org/licenses/>
--!
--! @brief Some description can be added here
--! also in multi-lines
--! @details Another description can be added here
--! And more core description can be added here

entity video_core is
  port (
    --! core clock, 100 Mhz
    clk : in std_logic;
    --! asynchronous active low reset
    reset_n : in std_logic;
    --! @portgroup axi_lite_config an AXI4-Lite interface to write core registers
    s_axi_awaddr  : in std_logic_vector(AXI_LITE_ADDR_WIDTH - 1 downto 0);
    s_axi_awprot  : in std_logic_vector(2 downto 0);
    s_axi_awvalid : in std_logic;
    s_axi_awready : out std_logic;
    s_axi_wdata   : in std_logic_vector(AXI_LITE_DATA_WIDTH - 1 downto 0);
    s_axi_wstrb   : in std_logic_vector((AXI_LITE_DATA_WIDTH/8) - 1 downto 0);
    s_axi_wvalid  : in std_logic;
    s_axi_wready  : out std_logic;
    s_axi_bresp   : out std_logic_vector(1 downto 0);
    s_axi_bvalid  : out std_logic;
    s_axi_bready  : in std_logic;
    s_axi_araddr  : in std_logic_vector(AXI_LITE_ADDR_WIDTH - 1 downto 0);
    s_axi_arprot  : in std_logic_vector(2 downto 0);
    s_axi_arvalid : in std_logic;
    s_axi_arready : out std_logic;
    s_axi_rdata   : out std_logic_vector(AXI_LITE_DATA_WIDTH - 1 downto 0);
    s_axi_rresp   : out std_logic_vector(1 downto 0);
    s_axi_rvalid  : out std_logic;
    s_axi_rready  : in std_logic;
    --! @end

    --! @portgroup video_in_axi_stream a slave axi stream interface for video in 
    --! axis data bus, transfers two pixels per clock with pixel width of 12 bits in mono color
    video_in_tdata  : in  std_logic_vector(23 downto 0);
    --! axis last, used to indicate the end of packet which in video context refer to line
    video_in_tlast  : in  std_logic;
    --! axis user, usually is user defined but in video context it marks the start of a frame
    video_in_tuser  : in  std_logic_vector(0 downto 0);
    --! axis valid handshake signal
    video_in_tvalid : in  std_logic;
    --! axis ready handshake signal
    video_in_tready : out std_logic;

    --! @portgroup video_out_axi_stream a master axi stream interface for video out 
    --! axis data bus, transfers two pixels per clock with pixel width of 10 bits in mono color
    video_out_tdata  : out std_logic_vector(23 downto 0);
    --! axis last, used to indicate the end of packet which in video context refer to line
    video_out_tlast  : out std_logic;
    --! axis user, usually is user defined but in video context it marks the start of a frame
    video_out_tuser  : out std_logic_vector(0 downto 0);
    --! axis valid handshake signal
    video_out_tvalid : out std_logic;
    --! axis ready handshake signal
    video_out_tready : in  std_logic;
    --! @end

    --! data out signal, read data from memory
    mem_dout : in  std_logic_vector(LUT_WORD_SIZE-1 downto 0);
    --! memory address to enable read 
    mem_addr : out std_logic_vector(LUT_ADDR_SIZE-1  downto 0)
  );
end video_core;

architecture rtl of video_core is

begin

end architecture;