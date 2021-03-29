library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

library src_lib;
--
library vunit_lib;
context vunit_lib.vunit_context;

entity arith_counter_gray_tb is
  generic (runner_cfg : string);
end;

architecture bench of arith_counter_gray_tb is


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

  arith_counter_gray_inst : entity src_lib.arith_counter_gray
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

  main : process
  begin
    test_runner_setup(runner, runner_cfg);
    while test_suite loop
      if run("test_alive") then
        info("Hello world test_alive");
        wait for 100 * clk_period;
        test_runner_cleanup(runner);
        
      elsif run("test_0") then
        info("Hello world test_0");
        wait for 100 * clk_period;
        test_runner_cleanup(runner);
      end if;
    end loop;
  end process main;

--   clk_process : process
--   begin
--     clk <= '1';
--     wait for clk_period/2;
--     clk <= '0';
--     wait for clk_period/2;
--   end process clk_process;

end;