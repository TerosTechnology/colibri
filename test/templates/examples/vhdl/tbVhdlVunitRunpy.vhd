library	ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

library src_lib;
--
library vunit_lib;
context vunit_lib.vunit_context;
-- use vunit_lib.array_pkg.all;
-- use vunit_lib.lang.all;
-- use vunit_lib.string_ops.all;
-- use vunit_lib.dictionary.all;
-- use vunit_lib.path.all;
-- use vunit_lib.log_types_pkg.all;
-- use vunit_lib.log_special_types_pkg.all;
-- use vunit_lib.log_pkg.all;
-- use vunit_lib.check_types_pkg.all;
-- use vunit_lib.check_special_types_pkg.all;
-- use vunit_lib.check_pkg.all;
-- use vunit_lib.run_types_pkg.all;
-- use vunit_lib.run_special_types_pkg.all;
-- use vunit_lib.run_base_pkg.all;
-- use vunit_lib.run_pkg.all;

entity example_vhdl_tb is
  generic (runner_cfg : string);
end;


architecture bench of example_vhdl_tb is

  -- Clock period
  constant clk_period : time := 5 ns;
  -- Generics
  constant g_GENERIC_0 : integer:=5;
  constant g_GENERIC_1 : integer:=5;

  -- Ports
  signal clk : std_logic;
  signal rst : std_logic;
  signal inc : std_logic;
  signal dec : std_logic;
  signal val : std_logic_vector(g_GENERIC_0-1 downto 0);
  signal cry : std_logic;

begin

  example_vhdl_inst : entity src_lib.arith_counter_gray
    generic map (
      BITS => g_GENERIC_0,
      INIT => g_GENERIC_1
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
        wait for 100 ns;
        test_runner_cleanup(runner);

      elsif run("test_0") then
        info("Hello world test_0");
        wait for 100 ns;
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
