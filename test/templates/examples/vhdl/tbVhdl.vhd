library	ieee;
use  ieee.std_logic_1164.all;
use  ieee.numeric_std.all;

entity example_vhdl_tb is
end;

architecture bench of example_vhdl_tb is

  component example_vhdl
    generic (
      g_GENERIC_0 : integer;
      g_GENERIC_1 : integer
    );
    port (
      clk : in std_logic;
      rst : in std_logic;
      inc : in std_logic;
      dec : in std_logic;
      val : out std_logic_vector(g_GENERIC_0-1 downto 0);
      cry : out std_logic_vector(10 downto 0)
    );
  end component;

  -- Clock period
  constant clk_period : time := 5 ns;
  -- Generics
  constant g_GENERIC_0 : integer;
  constant g_GENERIC_1 : integer;

  -- Ports
  signal clk : std_logic;
  signal rst : std_logic;
  signal inc : std_logic;
  signal dec : std_logic;
  signal val : std_logic_vector(g_GENERIC_0-1 downto 0);
  signal cry : std_logic_vector(10 downto 0);

begin

  example_vhdl_inst : example_vhdl
    generic map (
      g_GENERIC_0 => g_GENERIC_0,
      g_GENERIC_1 => g_GENERIC_1
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
