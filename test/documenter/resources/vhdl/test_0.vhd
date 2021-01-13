library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

--! Description entity
entity structure is
  generic (
    g_GENERIC_0 : integer;
    g_GENERIC_1 : integer --! Description generic
  );
  port (
    clk : in std_logic;
    rst : in std_logic;
    inc : in std_logic; --! Description port
    dec : in std_logic;
    val : out std_logic_vector(g_GENERIC_0 - 1 downto 0);
    cry : out std_logic_vector(10 downto 0)
  );
end entity;

architecture rtl of structure is

begin

end architecture;