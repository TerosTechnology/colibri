library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity arith_counter_gray_tb is
end;

architecture bench of arith_counter_gray_tb is

  component arith_counter_gray
    generic (
      BITS : positive;
      INIT : natural
    );
    port (
      clk : in std_logic;
      rst : in std_logic;
      inc : in std_logic;
      dec : in std_logic;
      val : out std_logic_vector(BITS-1 downto 0);
      cry : out std_logic
    );
  end component;

  -- Clock period
  constant clk_period : time := 5 ns;
  -- Generics
  constant BITS : positive := 8;
  constant INIT : natural := 0;

  -- Ports
  signal clk : std_logic;
  signal rst : std_logic;
  signal inc : std_logic;
  signal dec : std_logic;
  signal val : std_logic_vector(BITS-1 downto 0);
  signal cry : std_logic;

begin

  arith_counter_gray_inst : arith_counter_gray
    generic map (
      BITS => BITS,
      INIT => INIT
    )
    port map (
      clk => clk,
      rst => rst,
      inc => inc,
      dec => dec,
      val => val,
      cry => cry
    );

--   clk_process : process
--   begin
--     clk <= '1';
--     wait for clk_period/2;
--     clk <= '0';
--     wait for clk_period/2;
--   end process clk_process;

end;
