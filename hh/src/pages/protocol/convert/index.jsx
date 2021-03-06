import React from 'react';
import Container from '../components/Container';
import Title from '../components/Title';
import Content from '../components/Content';

const ProtocolConvert = () => (
  <Container>
    <Title>兑换协议</Title>
    <Content>
      <Content.Item>
        1.
        每位用户均可在平台通过直播/发布文章等形式获取劳务报酬所得。如果您是主播，可在个人中心-我的收益绑定银行卡，查询收支信息，如果您是作者，可在“专家号”我的收益中绑定银行卡、查询收支信息（请确保您的银行卡号与实名认证一致，银行支行填写正确）。
      </Content.Item>
      <Content.Item>
        2.
        您的账户中包含已结算金额（包括礼物收益/主播佣金/文章收益等部分，根据身份不同，收益类型各不相同），每次仅可申请提取“已结算金额”的部分。用户申请提取的“已结算金额”，由U球平台和用户个人按照6:4比例进行分成，用户所得的部分按照税法规定计算缴纳个人所得税。
      </Content.Item>
      <Content.Item>
        3. 提现时间为每月的10~15号，
        可提现金额大于100元方可提取，本平台会将该部分收益转账给用户，您可在收益兑换-兑换记录实时查看兑换进度。如因银行信息登记有误导致转账失败的，本平台会重新联系该用户进行转账，同时如果您发起兑换后有信息变更等需求，请联系官方客服QQ:383883567。
      </Content.Item>
      <Content.Item>
        4. 依据税法规定，您在“U球”平台所获得的收入为“劳务报酬所得”，需按照劳务报酬所得缴纳个人所得税，计算方法如下：
      </Content.Item>
      <Content.Item>
        （1）劳务报酬所得≤800元时，应纳税额为零；
      </Content.Item>
      <Content.Item>
        （2）800＜劳务报酬所得＜4,000元，应纳税所得额=每次收入额-800，适用税率为20%，应纳税额=应纳税所得额×20%；
      </Content.Item>
      <Content.Item>
        （3）劳务报酬所得≥4,000元，应纳税所得额=每次收入额×（1-20%），应纳税额=应纳税所得额×适用税率-速算扣除数；适用的税率及速算扣除数如下：
      </Content.Item>
      <Content.Item>
        1）应纳税所得额不超过20,000元，税率为20%，速算扣除数为零；
      </Content.Item>
      <Content.Item>
        2）应纳税所得额超过20,000元、不超过50,000元，税率为30%，速算扣除数为2,000；
      </Content.Item>
      <Content.Item>
        3）应纳税所得额超过50,000元以上，税率为40%，速算扣除数为7,000;
      </Content.Item>
      <Content.Item>
        具体兑换金额请已实际到账金额为主，如有问题，请及时联系官方客服。
      </Content.Item>
    </Content>
  </Container>
);

export default ProtocolConvert;
