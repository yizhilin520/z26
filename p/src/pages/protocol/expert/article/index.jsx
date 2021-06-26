import React from 'react';
import Container from '../../components/Container';
import Title from '../../components/Title';
import Content from '../../components/Content';
import Table from '../../components/Table';

const ProtocolExpertArticle = () => (
  <Container>
    <Title>专家号发文规范</Title>
    <Content>
      <Content.Item>为规范管理专家号，为作者及用户打造公平、高品质的平台，特发公告及规则如下，请认真阅读了解规范：</Content.Item>
      <Content.Item><Content.Bold>一、发文规则</Content.Bold></Content.Item>
      <Content.Item>1.奖金指数</Content.Item>
      <Content.Item>单式投注方案，竞彩SP指数不得低于1.45；</Content.Item>
      <Content.Item>复式投注方案，竞彩SP指数不得低于2.2；</Content.Item>
      <Content.Item>2.内容要求</Content.Item>
      <Content.Item>所有专家姓名、方案标题、方案理由不得出现赌博、盘口、赔率相关词汇，具体包括但不限于以下话术：欧赔、赔率、水位、盘口、亚盘、解盘、赌博、博彩、庄家、庄狗、大小球、波胆、走盘、走水、降盘、降水、升盘、升水、调盘、调赔、博彩公司名称等。部分禁用词建议使用下表词汇替代：</Content.Item>
      <Content.Item>
        <Table
          list={[
            ['禁用词', '替代词'],
            ['亚盘', '亚洲指数/数据'],
            ['欧赔', '欧洲指数/数据'],
            ['赔率/水位', '奖金/指数'],
            ['初盘/终盘', '初始指数/数据/最终指数/数据'],
            ['大小球（足球）', '总进球数/进球数'],
            ['大小球（篮球）', '大小分'],
            ['盘口', '让球指数/数据'],
            ['波胆', '比分'],
            ['上盘/下盘', '让球方/受让方'],
            ['升水/升赔', '指数上调'],
            ['降水/降赔', '指数下调'],
            ['庄家/博彩公司', '机构']
          ]}
        />
      </Content.Item>
      <Content.Item>3.发布时间：</Content.Item>
      <Content.Item>时间：当日早场比赛不得晚于比赛开始前1小时发布；当日晚场比赛请于19:00之前发布；</Content.Item>
      <Content.Item><Content.Bold>二、保护原创内容，严厉抄袭行为</Content.Bold></Content.Item>
      <Content.Item>1. 抄袭的鉴定</Content.Item>
      <Content.Item>①推荐文章与他人文章内容完全重合或由多篇文章拼凑而成（包括专家号内及其他任意网站内容）；</Content.Item>
      <Content.Item>②推荐文章主体结构及文意同时与他人文章内容重合，无原创核心内容；</Content.Item>
      <Content.Item>③专家号作者在多平台同时发文的情况，需满足平台用户名相同（需提供证明本人为同一原创作者），否则按照抄袭处理；</Content.Item>
      <Content.Item>④一人同时拥有多个专家号，使用不同专家号作者发布相同文章的情况，按照发布时间顺序，后发推荐文章按抄袭处理（专家号为实名注册，一人只能注册一个账号，但实际使用中，出现一人同时操作多个利用不同身份注册的专家号的情况，专家号官方对此行为不予支持）。</Content.Item>
      <Content.Item>2.抄袭的处理</Content.Item>
      <Content.Item>用户举报抄袭经专家号官方鉴定属实，将做出如下处理：</Content.Item>
      <Content.Item>①付费推荐抄袭：注销专家号资格，该篇文章付费部分将返还用户；</Content.Item>
      <Content.Item>②免费推荐抄袭：首次发现按照抄袭给予警告，第二次发现注销专家号资格；</Content.Item>
      <Content.Item>③被认定文章抄袭的作者，有权在三日内联系客服进行抄袭认定申诉，超过三日将被视为放弃认定权，此后如申请抄袭认定申诉将被拒绝处理；</Content.Item>
      <Content.Item>④进行抄袭认定的作者，如申诉成功，将取消之前的抄袭认定，如申诉失败，专家号将被注销。</Content.Item>
      <Content.Item><Content.Bold>三、维护价值，提高内容质量</Content.Bold></Content.Item>
      <Content.Item>推荐内容是专家号的核心，也是专家号作者与用户间的桥梁。为了避免无实质内容、堆积数据等内容质量差的推荐文章，保证用户的阅读体验，现面向专家号作者及用户申明专家号官方对内容质量的规定。</Content.Item>
      <Content.Item>1. 内容质量差的鉴定</Content.Item>
      <Content.Item>经用户举报内容质量差的文章，专家号官方会对推荐进行审核，内容质量差的判定标准如下：</Content.Item>
      <Content.Item>①文章内容与推荐比赛无关（例：无意义累积字数达到最低标准，文不对题等情况）；</Content.Item>
      <Content.Item>②无原创核心内容（例：简单罗列基本面信息基本面信息、文章内容不足以推导结果等情况）；</Content.Item>
      <Content.Item>③使用虚假、夸大内容（例：使用虚假、夸大、诱导性内容等情况）；</Content.Item>
      <Content.Item>④其他可清晰认定质量差、影响阅读体验的内容。</Content.Item>
      <Content.Item>2. 内容质量差文章示例</Content.Item>
      <Content.Item>以下为内容质量差文章示例，内容质量差的文章包括但不仅限于以下内容。</Content.Item>
      <Content.Item>2.1 文章内容与推荐比赛无关</Content.Item>
      <Content.Item>①无意义累积字数</Content.Item>
      <Content.Item>评定标准：与赛事无关内容超过全文1/4、通过标点符号等方式凑字数的情况。</Content.Item>
      <Content.Item>②文不对题</Content.Item>
      <Content.Item>评定标准：发送文章与所选比赛无关，通常为选错比赛的情况。</Content.Item>
      <Content.Item>③所选结果与文章结论相反</Content.Item>
      <Content.Item>评定标准：文章得出的结论与所选赛事结果不同，通常为文章分析胜负结果选择大小球、或者因疏忽推荐赛果选择错误的情况。</Content.Item>
      <Content.Item>④重复复制相同内容</Content.Item>
      <Content.Item>评定标准：作者每篇文章重复复制粘贴相同内容超过全文1/4，包括付费文章的免费部分。</Content.Item>
      <Content.Item>2.2 无原创核心内容</Content.Item>
      <Content.Item>①简单罗列基本面信息。</Content.Item>
      <Content.Item>评定标准：罗列数据超过文章内容1/2，包括主客队X胜X平X负、主客队进失球数、主客队近X场胜负、主客队近期交锋记录、比赛赔率及其他任何数据。</Content.Item>
      <Content.Item>②文章内容不足以推导出推荐结果</Content.Item>
      <Content.Item>评定标准：文章论据不足，无法推导出推荐结果的情况。如只有“主队主场龙，客队客场虫，看好主胜”等类似的主观印象型论据。</Content.Item>
      <Content.Item>2.3 使用虚假、夸大内容</Content.Item>
      <Content.Item>①使用虚假编造内容作为推荐依据</Content.Item>
      <Content.Item>评定标准：推荐文章中的内容存在不实或为了推导推荐结果杜撰信息。</Content.Item>
      <Content.Item>②虚假编造战绩统计</Content.Item>
      <Content.Item>评定标准：作者战绩统计以专家号官方统计为准，作者文章中不可出现虚假统计、自我统计或不易查询的统计数据。如作者A在过去20篇推荐中有三篇NBA比赛全红，但三场NBA间隔时间较长，用户不易查询的情况。</Content.Item>
      <Content.Item>③出现夸大、诱导性文字</Content.Item>
      <Content.Item>判定标准：标题、或文章中出现诱导性文字内容。如作者A目前5连红，当日连续发文2篇，发文使用“冲击7连红”等；在标题及文章中使用“重锤单”、“此单必杀”、“本场必中”、“信心单”、“XX%信心”等文字，或在总结过去推荐中使用“重锤连红”、“稳胆全中”等。专家号作者推荐文章时，每篇文章都应具备相同的认真态度，不可出现某一场比赛特别研究、特别看好等诱导性标题。</Content.Item>
      <Content.Item>2.4 其他可清晰认定质量差、影响阅读体验的内容</Content.Item>
      <Content.Item>①文章中无清晰表述对阵双方</Content.Item>
      <Content.Item>评定标准：全文没有出现对阵双方球队名称，以主队、客队或其他方式代称的情况。</Content.Item>
      <Content.Item>②大量错别字、标点符号及排版混乱的情况</Content.Item>
      <Content.Item>评定标准：错别字大于5个或关键错别字影响阅读体验；标点符号使用混乱；长篇文章不分段落、排版混乱等。</Content.Item>
      <Content.Item>③使用非中文预言发文</Content.Item>
      <Content.Item>评定标准：标题、文章中全部或部分使用外文预言，如全篇英文、标题英文、球队名使用英文的情况。</Content.Item>
      <Content.Item>④付费文章，免费的内容被全部或部分复制到付费内容中。</Content.Item>
      <Content.Item>⑤标题过于随意、凑字数等情况。</Content.Item>
      <Content.Item>⑥其他影响用户阅读体验的文章内容。</Content.Item>
      <Content.Item>3.内容质量差的处理</Content.Item>
      <Content.Item>用户举报文章内容质量差经专家号官方鉴定属实，将做出如下处理：</Content.Item>
      <Content.Item>①扣除相应积分，如涉及付费阅读，该篇文章付费部分将返还用户；</Content.Item>
      <Content.Item>②大量出现内容质量差文章的作者，将做出注销专家号处理。</Content.Item>
    </Content>
  </Container>
);

export default ProtocolExpertArticle;
