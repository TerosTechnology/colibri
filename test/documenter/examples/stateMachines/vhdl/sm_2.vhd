-- Copyright 2020
--
-- Ismael Perez Rojo (ismaelprojo@gmail.com)
-- Carlos Alberto Ruiz Naranjo (carlosruiznaranjo@gmail.com)
--
-- This file is part of Colibri.
--
-- Colibri is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- Colibri is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

case r_st_present is
  when ST_ST_GET_PROD_REQ  =>
    w_st_next  <= ST_CHECK_CREDIT;

  when ST_RESET =>
    w_st_next <= ST_CHECK_CREDIT;

  when ST_CHECK_CREDIT     =>
    if (r_price_product_counter>=r_price_product) then
      w_st_next  <= ST_PROVIDE_PRODUCT;
    elsif(i_refund_request='1') then
      w_st_next  <= ST_PROVIDE_TOTAL_REFUND;
    else
      w_st_next  <= ST_CHECK_CREDIT;
    end if;

  when ST_PROVIDE_PRODUCT  =>
    w_st_next  <= ST_PROVIDE_REFUND;

  when ST_PROVIDE_REFUND   =>
    w_st_next  <= ST_RESET;

  when ST_PROVIDE_TOTAL_REFUND   =>
    w_st_next  <= ST_RESET;

  when others=> -- ST_RESET            =>
    if (i_product_sel_valid='1') then
      w_st_next  <= ST_ST_GET_PROD_REQ;
    else
      w_st_next  <= ST_RESET;
    end if;
end case;
end process p_comb;
