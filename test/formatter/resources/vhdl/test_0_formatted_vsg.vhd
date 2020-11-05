--------------------------------------
-- OR gate (ESD book figure 2.3)
--
-- two descriptions provided
--------------------------------------

library ieee;
  use ieee.std_logic_1164.all;

--------------------------------------

entity OR_ENT is
  port (
    X : in    std_logic;
    Y : in    std_logic;
    F : out   std_logic
  );
end entity OR_ENT;

---------------------------------------

architecture OR_ARCH of OR_ENT is

begin

  process (x, y) is
  begin

    -- compare to truth table
    if ((x='0') and (y='0')) then
      F <= '0';
    else
      F <= '1';
    end if;

  end process;

end architecture OR_ARCH;

architecture OR_BEH of OR_ENT is

begin

  F <= x or y;

end architecture OR_BEH;

---------------------------------------
