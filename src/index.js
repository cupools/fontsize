import postcss from 'postcss'
import fontsize from './fontsize'

export default postcss.plugin('postcss-fontsize', opts => fontsize(opts))
