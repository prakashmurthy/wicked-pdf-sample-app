function AircellTools (form_element) {
  this.element = form_element;
  this.initialize();
}

AircellTools.prototype = {
  initialize: function () {
    var self = this;
    this.reset();

    this.element.submit(function () {
      self.calculate();
      return false;
    });

    this.element.find('input[name="reset"]').click(function () {
      self.reset();
      return false;
    });
  },
  calculate: function () {
    this.calcInstallResale();
    this.calcRevenue();
    this.calcPayback();
  },
  calcInstallResale: function () {
    var B4 = this.inputAsNumber('B4');
    var B5 = this.inputAsNumber('B5');
    var B6 = null;

    if (!isNaN(B4) && !isNaN(B5)) {
      if (B5 > 1.0) B5 = B5 / 100.0;
      B4 = B4 * -1;
      B6 = this.toMoneyStr((B4 * (1-B5)) * -1);
    }

    this.setOutput('B6', B6);
  },
  calcRevenue: function () {
    var B6  = this.spanAsNumber('B6');
    var B12 = this.inputAsNumber('B12');
    var B13 = this.inputAsNumber('B13');
    var B14 = this.inputAsNumber('B14');
    var E12 = this.inputAsNumber('E12');
    var E13 = this.inputAsNumber('E13');
    var E14 = this.inputAsNumber('E14');

    var B15 = null;
    var H12 = null;
    var H13 = null;
    var H14 = null;
    var H15 = null;

    var XX = null;
    var YY = null;
    var ZZ = null;
    var AA = null;
    var BB = null;
    var CC = null;

    if (!isNaN(B13) && !isNaN(B14) && !isNaN(B12)) {
      B15 = (B13 - B14) * B12;
    }

    if (!isNaN(E12) && !isNaN(B12)) {
      H12 = E12 + B12;
    }

    if (!isNaN(E13) && !isNaN(B13)) {
      H13 = E13 + B13;
    }

    if (!isNaN(E14) && !isNaN(B14)) {
      H14 = E14 + B14;
    }

    if (H13 && H14 && H12) {
      H15 = (H13 - H14) * H12 - 2195;
    }

    if (!isNaN(E12)) XX = E12;
    if (!isNaN(E13)) YY = E13;
    if (H15 && B15) ZZ = H15 - B15;
    if (ZZ) AA = ZZ * 3 * 12;
    if (ZZ) BB = ZZ * 5 * 12;
    if (!isNaN(B6) && ZZ) CC = (B6) / (ZZ * 12);

    if (B15) B15 = this.toMoneyStr(B15);
    if (H12) H12 = H12.toFixed(1);
    if (H13) H13 = this.toMoneyStr(H13);
    if (H14) H14 = this.toMoneyStr(H14);
    if (H15) H15 = this.toMoneyStr(H15);

    if (XX) XX = XX.toFixed(1);
    if (YY) YY = YY.toFixed(2);
    if (CC) CC = CC.toFixed(2);

    this.setOutput('B15', B15);
    this.setOutput('H12', H12);
    this.setOutput('H13', H13);
    this.setOutput('H14', H14);
    this.setOutput('H15', H15);
    this.setOutput('XX',  XX);
    this.setOutput('YY',  YY);
    this.setOutput('CC',  CC);

    this.outputIncomeOrLoss('ZZ', ZZ);
    this.outputIncomeOrLoss('AA', AA);
    this.outputIncomeOrLoss('BB', BB);
  },
  calcPayback: function () {
    var B6  = this.spanAsNumber('B6');
    var B12 = this.inputAsNumber('B12');
    var B13 = this.inputAsNumber('B13');
    var B14 = this.inputAsNumber('B14');
    var B25 = this.inputAsNumber('B25');
    var E25 = this.inputAsNumber('E25');
    var H12 = this.spanAsNumber('H12');
    var H13 = this.spanAsNumber('H13');
    var H14 = this.spanAsNumber('H14');

    var B26 = null;
    var B27 = null;
    var B28 = null;
    var B29 = null;
    var B30 = null;

    var E26 = null;
    var E27 = null;
    var E28 = null;
    var E30 = null;

    if (!isNaN(B6)) B26 = B6 * -1;
    if (!isNaN(B25)) B27 = -2195 * B25;
    if (B26 && B27) B28 = B26 + B27;
    if (!isNaN(B13) && !isNaN(B14)) B29 = B13 - B14;

    if (B28 && B29) {
      B30 = B28 / B29 / -12;
    }

    if (!isNaN(B6)) E26 = B6 * -1;
    if (!isNaN(E25)) E27 = -2195 * E25;
    if (E26 && E27) E28 = E26 + E27;

    if (E28 && !isNaN(E25) && !isNaN(B12)) {
      E30 = (E28 / (E25 * B12)) * -1;
    }

    this.setOutput('B30', B30 && B30.toFixed(2));
    this.setOutput('E30', E30 && this.toMoneyStr(E30));
  },
  inputAsNumber: function (id) {
    return this.toNumber(this.element.find('input[name="' + id + '"]').val());
  },
  spanAsNumber: function (id) {
    return this.toNumber(this.element.find('#' + id).first().html());
  },
  toNumber: function (raw) {
    return parseFloat(raw.replace(/[$,]/, ''));
  },
  toMoneyStr: function (val) {
    var s = val.toFixed(2);
    var re = new RegExp('(-?[0-9]+)([0-9]{3})');
    while (re.test(s)) {s = s.replace(re, '$1,$2');}
    return s;
  },
  outputIncomeOrLoss: function (id, val) {
    this.setOutput(id, val && this.toMoneyStr(Math.abs(val)));
    this.setOutput(id + 'IL', val && (val >= 0 ? "income" : "loss"));
  },
  setOutput: function (id, val) {
    var cell = this.element.find('#' + id).first();
    var def_val = cell.attr('data-default');

    if (val) {
      cell.html(val);
    } else if (def_val) {
      cell.html(def_val);
    } else {
      cell.html("");
    }
  },
  reset: function () {
    var self = this;

    this.element.find('input[type="text"]').each(function (i) {
      var e = jQuery(this);
      var def_val = e.attr('data-default');
      e.val(def_val || '');
    });

    this.element.find('span').each(function (i) {
      if (this.id) self.setOutput(this.id, null);
    });
  }
};

jQuery(document).ready(function () {
  var calc_tools = jQuery('#aircell-tools');
  if (calc_tools) new AircellTools(calc_tools);
});
